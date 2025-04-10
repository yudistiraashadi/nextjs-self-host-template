import { apiRegistry } from "@/server-api/api-registry";
import { NextRequest, NextResponse } from "next/server";

// Import this file to ensure all API functions are registered
import "@/server-api/api-imports";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ all: string[] }> },
) {
  const { all } = await params;

  // Reconstruct the path from the segments
  const path = `/${all.join("/")}`;

  // Find the handler for this path
  const handler = apiRegistry.getHandler(path);

  if (!handler) {
    return NextResponse.json(
      { error: `No handler found for path: ${path}` },
      { status: 404 },
    );
  }

  return handler(req, { params });
}
