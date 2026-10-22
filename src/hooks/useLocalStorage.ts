import { useCallback, useEffect, useState } from 'react';
import { safeGetRaw, safeSetRaw } from '../services/storageService';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  sanitize?: (parsed: unknown) => T
): [T, (updater: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const raw = safeGetRaw(key);
    if (!raw) return initialValue;
    try {
      const parsed: unknown = JSON.parse(raw);
      return sanitize ? sanitize(parsed) : (parsed as T);
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = updater instanceof Function ? updater(prev) : updater;
        safeSetRaw(key, JSON.stringify(nextValue));
        return nextValue;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const parsed: unknown = JSON.parse(event.newValue);
          setStoredValue(sanitize ? sanitize(parsed) : (parsed as T));
        } catch {
          /* ignore invalid external writes */
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, sanitize]);

  return [storedValue, setValue];
}
