interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean expired records every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * In-memory sliding window rate limiter
 * @param ip Client IP address or unique key
 * @param limit Max requests allowed per window (default: 60)
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 min)
 */
export function checkRateLimit(
  ip: string,
  limit: number = 300,
  windowMs: number = 60_000
): RateLimitResult {
  const isLocal = ip === "127.0.0.1" || ip === "::1" || ip === "localhost" || ip.startsWith("192.168.") || ip.startsWith("10.");
  const effectiveLimit = isLocal ? Math.max(limit, 2000) : limit;
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    // New or expired window
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit: effectiveLimit,
      remaining: effectiveLimit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (record.count >= effectiveLimit) {
    return {
      success: false,
      limit: effectiveLimit,
      remaining: 0,
      reset: Math.ceil(record.resetAt / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: effectiveLimit,
    remaining: effectiveLimit - record.count,
    reset: Math.ceil(record.resetAt / 1000),
  };
}
