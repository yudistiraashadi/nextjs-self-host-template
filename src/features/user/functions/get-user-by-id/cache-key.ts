import { hashKey } from "@/lib/revalidate-cache/utils";

export function getUserByIdCacheKey(id: string) {
  return [
    "user",
    {
      id: id,
    },
  ];
}

export function getUserByIdCacheKeyHashed(id: string) {
  return hashKey(getUserByIdCacheKey(id));
}
