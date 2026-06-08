interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  fetchedAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) return null;
  return entry.value as T;
}

/** Returns cached value even when TTL expired — used as fallback when scrape fails. */
export function getCachedStale<T>(
  key: string
): { value: T; fetchedAt: number; stale: boolean } | null {
  const entry = store.get(key);
  if (!entry) return null;
  return {
    value: entry.value as T,
    fetchedAt: entry.fetchedAt,
    stale: Date.now() > entry.expiresAt,
  };
}

export function getCachedMeta(key: string): { fetchedAt: number } | null {
  const entry = store.get(key);
  if (!entry) return null;
  return { fetchedAt: entry.fetchedAt };
}

export function setCached<T>(key: string, value: T, ttlMs: number): void {
  const now = Date.now();
  store.set(key, {
    value,
    fetchedAt: now,
    expiresAt: now + ttlMs,
  });
}
