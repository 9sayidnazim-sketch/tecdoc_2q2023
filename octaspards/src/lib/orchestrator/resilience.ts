/**
 * Resilience, Circuit Breaker, Bounded Concurrency & Secret Redaction
 * Protects downstream services and prevents resource starvation
 */

import type { ProviderId } from "./types";

// 1. Secret Redaction
const SECRET_PATTERNS = [
  /tecdoc_partner_[a-zA-Z0-9_\-]+/gi,
  /oem_parts_[a-zA-Z0-9_\-]+/gi,
  /autodoc_partner_[a-zA-Z0-9_\-]+/gi,
  /dubai_central_[a-zA-Z0-9_\-]+/gi,
  /octaspards-admin-[a-zA-Z0-9_\-]+/gi,
  /password=[^&\s]+/gi,
  /Bearer\s+[a-zA-Z0-9_\-\.]+/gi,
  /X-API-Key:\s*([a-zA-Z0-9_\-]+)/gi,
  /api[_-]?key[:=]\s*["']?([a-zA-Z0-9_\-]+)["']?/gi,
];

export function redactSecrets(message: string): string {
  if (!message) return "";
  let sanitized = message;
  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[REDACTED_SECRET]");
  }
  return sanitized;
}

export function logRedacted(level: "info" | "warn" | "error", message: string, meta?: any) {
  const cleanMsg = redactSecrets(message);
  let cleanMeta = meta;
  if (meta && typeof meta === "object") {
    try {
      cleanMeta = JSON.parse(redactSecrets(JSON.stringify(meta)));
    } catch {
      cleanMeta = "[Unparseable Metadata]";
    }
  }
  if (level === "error") {
    console.error(`[Search Orchestrator Error]: ${cleanMsg}`, cleanMeta || "");
  } else if (level === "warn") {
    console.warn(`[Search Orchestrator Warn]: ${cleanMsg}`, cleanMeta || "");
  } else {
    console.info(`[Search Orchestrator Info]: ${cleanMsg}`, cleanMeta || "");
  }
}

// 2. Circuit Breaker Implementation
interface CircuitState {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean;
}

const circuitStates = new Map<ProviderId, CircuitState>();
const FAILURE_THRESHOLD = 3; // Trip after 3 consecutive errors
const RESET_TIMEOUT_MS = 30_000; // Cool-off period: 30s

export function isCircuitOpen(providerId: ProviderId): boolean {
  const state = circuitStates.get(providerId);
  if (!state || !state.isOpen) return false;

  const now = Date.now();
  if (now - state.lastFailureTime > RESET_TIMEOUT_MS) {
    // Half-open: allow probe request
    state.isOpen = false;
    state.failures = 0;
    return false;
  }
  return true;
}

export function recordProviderSuccess(providerId: ProviderId): void {
  const state = circuitStates.get(providerId);
  if (state) {
    state.failures = 0;
    state.isOpen = false;
  }
}

export function recordProviderFailure(providerId: ProviderId, _error?: any): void {
  const now = Date.now();
  const current = circuitStates.get(providerId) || { failures: 0, lastFailureTime: 0, isOpen: false };
  current.failures += 1;
  current.lastFailureTime = now;
  if (current.failures >= FAILURE_THRESHOLD) {
    current.isOpen = true;
    logRedacted("warn", `Circuit breaker tripped for provider ${providerId} after ${current.failures} consecutive failures.`);
  }
  circuitStates.set(providerId, current);
}

// 3. Timeout Wrapper
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  providerId: ProviderId
): Promise<T> {
  let timerId: NodeJS.Timeout | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`Timeout of ${timeoutMs}ms exceeded for provider ${providerId}`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    if (timerId) clearTimeout(timerId);
    return result;
  } finally {
    if (timerId) clearTimeout(timerId);
  }
}

// 4. In-Flight Request Deduplication
const inFlightRequests = new Map<string, Promise<any>>();

export function deduplicateRequest<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) {
    return existing;
  }

  const promise = fn().finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, promise);
  return promise;
}

// 5. Bounded Concurrency Pool (p-limit equivalent)
export async function runWithConcurrencyLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      if (index >= items.length) break;
      const item = items[index];
      if (item === undefined) break;
      try {
        const val = await fn(item);
        results[index] = { status: "fulfilled", value: val };
      } catch (err: any) {
        results[index] = { status: "rejected", reason: err };
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
