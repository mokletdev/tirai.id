"use client";

import { useEffect, useState } from "react";

export const useLocalStorage = <T>(key: string) => {
  const [storedValue, setStoredValue] = useState<T>();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    try {
      const item = localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : undefined);
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
    }
  }, [key, isHydrated]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };

  return [storedValue, setValue] as const;
};
