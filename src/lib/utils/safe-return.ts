export type SafeReturn<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export function safeReturn<T>(
  promise: Promise<T>,
  err?: string,
): Promise<SafeReturn<T>>;
export function safeReturn<T>(func: () => T, err?: string): SafeReturn<T>;
export function safeReturn<T>(
  promiseOrFunc: Promise<T> | (() => T),
  err?: string,
): Promise<SafeReturn<T>> | SafeReturn<T> {
  if (promiseOrFunc instanceof Promise) {
    return safeAsyncReturn(promiseOrFunc, err);
  }
  return safeSyncReturn(promiseOrFunc, err);
}

async function safeAsyncReturn<T>(
  promise: Promise<T>,
  err?: string,
): Promise<SafeReturn<T>> {
  try {
    const data = await promise;
    return { data, success: true };
  } catch (e) {
    console.error(e);
    if (err !== undefined) {
      return { success: false, error: err };
    }
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "Something went wrong" };
  }
}

function safeSyncReturn<T>(func: () => T, err?: string): SafeReturn<T> {
  try {
    const data = func();
    return { data, success: true };
  } catch (e) {
    console.error(e);
    if (err !== undefined) {
      return { success: false, error: err };
    }
    if (e instanceof Error) {
      return { success: false, error: e.message };
    }
    return { success: false, error: "Something went wrong" };
  }
}
