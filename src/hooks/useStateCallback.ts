import { SetStateAction, useCallback, useEffect, useRef } from 'react';
// 使用 ahooks useSetState 实现Object Merge
import { useSetState } from 'ahooks';

// 回调类型
type Callback<T extends object> = (value?: T) => void;
// 定义返回类型，state及回调
export type DispatchWithCallback<T extends object> = (value: T, callback?: Callback<T>) => void;

/**
 * hooks state回调
 * @param initialState {Object} 初始值-只能是对象(ahooks的useSetState 只支持对象)
 * @returns DispatchWithCallback [state, setState]
 */
function useStateCallback<T extends object>(
  initialState?: T,
): [T, DispatchWithCallback<SetStateAction<Partial<T>>>] {
  // @ts-ignore
  const [state, _setState] = useSetState(initialState);

  const callbackRef = useRef<Callback<T>>();
  const isFirstCallbackCall = useRef<boolean>(true);

  const setState = useCallback(
    (setStateAction: SetStateAction<Partial<T>>, callback?: Callback<T>): void => {
      callbackRef.current = callback;
      _setState(setStateAction);
    },
    [],
  );

  useEffect(() => {
    if (isFirstCallbackCall.current) {
      isFirstCallbackCall.current = false;
      return;
    }
    // @ts-ignore
    callbackRef.current?.(state);
  }, [state]);

  // @ts-ignore
  return [state, setState];
}

export default useStateCallback;
