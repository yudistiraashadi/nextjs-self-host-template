import { env } from "@/env";
import { S3Client } from "@aws-sdk/client-s3";

export function getStorageBucketAndPath(fullPath: string) {
  const [bucket, ...path] = fullPath.split("/");
  return { bucket, path: path.join("/") };
}

const S3_ACCESS_KEY = env.MINIO_ROOT_USER;
const S3_SECRET_KEY = env.MINIO_ROOT_PASSWORD;
const S3_ENDPOINT = env.MINIO_ENDPOINT;

// Configure S3-compatible client
export function getS3Client({
  region = "us-east-1",
}: { region?: string } = {}) {
  return new S3Client({
    region,
    endpoint: S3_ENDPOINT,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    forcePathStyle: true, // Required for most MinIO
  });
}
