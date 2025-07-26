const keyPrefix = 'meter-reading-';

export function getLocalStorage(key: string): string | null {
  return localStorage.getItem(keyPrefix + key);
}

export function setLocalStorage(
  key: string,
  value: string | null | undefined
): void {
  if (value === null || value === undefined) {
    localStorage.removeItem(keyPrefix + key);
  } else {
    localStorage.setItem(keyPrefix + key, value);
  }
}
