import { SetStateAction } from "react";
import { useState, useEffect, Dispatch, useCallback } from "react";

type SetValue<T> = Dispatch<SetStateAction<T | undefined>>;

export const useStorage = <T>(
  key: string,
  defaultValue: T
): [T | undefined, SetValue<T | undefined>, () => void] => {
  const [value, setValue] = useState<T | undefined>(() => {
    const jsonValue = window.sessionStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof defaultValue === "function") {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return window.sessionStorage.removeItem(key);
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);
  return [value, setValue, remove];
};
