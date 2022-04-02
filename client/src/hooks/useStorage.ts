import { SetStateAction } from "react";
import { useState, useEffect, Dispatch } from "react";

type SetValue<T> = Dispatch<SetStateAction<T>>;

export const useStorage = <T>(
  key: string,
  defaultValue: T
): [T, SetValue<T>] => {
  const [value, setValue] = useState<T>(() => {
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

  return [value, setValue];
};
