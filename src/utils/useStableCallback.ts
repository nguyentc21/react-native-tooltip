import { useRef, useCallback } from 'react';

type Cb = (...a: any[]) => any;

function useStableCallback<T extends Cb | null | undefined>(
  fn: T
): T extends Cb ? (...args: Parameters<T>) => ReturnType<T> : () => void {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback<any>((...args: any[]) => ref.current?.(...args), []);
}

export default useStableCallback;
