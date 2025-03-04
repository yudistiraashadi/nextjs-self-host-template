export async function tryCatchAsync<T>(
  promise: Promise<T>,
): Promise<[T | null, any | null]> {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    return [null, error];
  }
}
