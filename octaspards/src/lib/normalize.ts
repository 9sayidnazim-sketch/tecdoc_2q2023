/**
 * Normalise a part / OE / cross-reference number so that formatting differences
 * (spaces, dashes, dots, slashes, case) never affect matching.
 *   "0 986-494.124" -> "0986494124"
 *   "hu 719/7 x"    -> "HU7197X"
 */
export function normalizePartNumber(input: string): string {
  return input
    .normalize("NFKD")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/** True when the query looks like a part number (has at least one digit and few spaces). */
export function looksLikePartNumber(input: string): boolean {
  const trimmed = input.trim();
  if (!/\d/.test(trimmed)) return false;
  const words = trimmed.split(/\s+/).filter(Boolean);
  // "0 986 494 124" is a number, "brake disc 300mm front" is text
  return words.every((w) => /\d/.test(w) || w.length <= 3);
}

/** Normalise free text for vehicle/brand searching: collapse whitespace, trim, lower-case. */
export function normalizeText(input: string): string {
  return input.replace(/\s+/g, " ").trim().toLowerCase();
}

/** URL-friendly slug. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Score how well a candidate matches a normalised query. Used to order results
 * consistently: exact (3) > prefix (2) > contains (1) > fuzzy (similarity 0..1).
 */
export function matchRank(query: string, candidate: string, similarity = 0): number {
  if (!query) return 0;
  if (candidate === query) return 3;
  if (candidate.startsWith(query)) return 2;
  if (candidate.includes(query)) return 1;
  return Math.max(0, Math.min(1, similarity));
}

/** Levenshtein distance (bounded) for client-side typo tolerance on small lists. */
export function editDistance(a: string, b: string, max = 3): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const val = Math.min((prev[j] ?? 0) + 1, (cur[j - 1] ?? 0) + 1, (prev[j - 1] ?? 0) + cost);
      cur.push(val);
      if (val < rowMin) rowMin = val;
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length] ?? max + 1;
}

/** Filter a list of labelled options by a query with prefix/contains + typo tolerance. */
export function fuzzyFilter<T>(items: readonly T[], query: string, getLabel: (item: T) => string): T[] {
  const q = normalizeText(query);
  if (!q) return [...items];
  const scored: { item: T; score: number }[] = [];
  for (const item of items) {
    const label = normalizeText(getLabel(item));
    let score = -1;
    if (label === q) score = 4;
    else if (label.startsWith(q)) score = 3;
    else if (label.split(" ").some((w) => w.startsWith(q))) score = 2.5;
    else if (label.includes(q)) score = 2;
    else if (q.length >= 3) {
      const tolerance = q.length >= 6 ? 2 : 1;
      const words = label.split(" ");
      const best = Math.min(
        ...words.map((w) => editDistance(q, w.slice(0, Math.max(q.length, w.length)), tolerance)),
        editDistance(q, label.slice(0, q.length), tolerance),
      );
      if (best <= tolerance) score = 1 - best * 0.1;
    }
    if (score >= 0) scored.push({ item, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.item);
}
