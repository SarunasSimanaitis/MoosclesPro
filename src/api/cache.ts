const values = new Map<string, unknown>();
const pending = new Map<string, Promise<unknown>>();
const versions = new Map<string, number>();

export function cachedRequest<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (values.has(key)) return Promise.resolve(values.get(key) as T);

  const existing = pending.get(key);
  if (existing) return existing as Promise<T>;

  const version = versions.get(key) ?? 0;
  const request = load()
    .then((value) => {
      if ((versions.get(key) ?? 0) === version) values.set(key, value);
      return value;
    })
    .finally(() => {
      if (pending.get(key) === request) pending.delete(key);
    });

  pending.set(key, request);
  return request;
}

export function readCached<T>(key: string): T | undefined {
  return values.get(key) as T | undefined;
}

export function invalidateCached(...keys: string[]) {
  for (const key of keys) {
    versions.set(key, (versions.get(key) ?? 0) + 1);
    values.delete(key);
    pending.delete(key);
  }
}
