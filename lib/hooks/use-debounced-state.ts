import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

/**
 * `useDebouncedState` utilizes useDebounceValue from usehooks-ts to create a debounced state.
 * @param initialValue
 * @param delay - default delay is 300ms
 * @returns [value, debouncedValue, setValue]
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 300,
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useDebounceValue<T>(
    initialValue,
    delay,
  );

  useEffect(() => {
    setDebouncedValue(value);
  }, [value]);

  return [value, debouncedValue, setValue];
}
