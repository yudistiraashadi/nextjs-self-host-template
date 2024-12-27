export function getStorageBucketAndPath(fullPath: string) {
  const [bucket, ...path] = fullPath.split("/");
  return { bucket, path: path.join("/") };
}
