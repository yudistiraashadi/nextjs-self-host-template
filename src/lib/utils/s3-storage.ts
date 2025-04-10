import { env } from "@/env";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    region, // Required for AWS S3, but minio doesn't need it
    endpoint: S3_ENDPOINT,
    credentials: {
      accessKeyId: S3_ACCESS_KEY,
      secretAccessKey: S3_SECRET_KEY,
    },
    forcePathStyle: true, // Required for MinIO
  });
}

/**
 * Converts a stored image path to a URL
 * @param imagePath - The image path stored in the database (e.g., "post/123-abc.jpg")
 * @param options - Configuration options
 * @param options.isPrivate - Whether the file is in a private bucket requiring authentication (default: true)
 * @param options.expiresIn - Expiration time in seconds for signed URLs (default: 3600 = 1 hour)
 * @returns A URL for the image (signed URL for private files, direct URL for public files)
 */
export async function getMediaUrl(
  imagePath: string | null | undefined,
  options?: {
    isPrivate?: boolean;
    expiresIn?: number;
  },
): Promise<string | null> {
  if (!imagePath) return null;

  const { isPrivate = true, expiresIn = 3600 } = options || {};
  const { bucket, path } = getStorageBucketAndPath(imagePath);

  // For public files, return a direct URL
  if (!isPrivate) {
    return `${S3_ENDPOINT}/${bucket}/${path}`;
  }

  // For private files, generate a signed URL
  const s3Client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
  });

  try {
    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
}
