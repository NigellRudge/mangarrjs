import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function useDebouncedState<T>(
  initialState: T,
  delay: number = 400,
): [state: T, setState: Dispatch<SetStateAction<T>>, debouncedState: T] {
  const [state, setState] = useState(initialState);
  const [debouncedState, setDebouncedState] = useState(initialState);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedState(state);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [state, delay]);

  return [state, setState, debouncedState];
}
