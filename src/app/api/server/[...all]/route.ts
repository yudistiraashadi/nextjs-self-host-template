import { apiRegistry } from "@/lib/server-api/api-registry";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { all: string[] } },
) {
  // Reconstruct the path from the segments
  const path = `/${context.params.all.join("/")}`;

  // Find the handler for this path
  const handler = apiRegistry.getHandler(path);

  if (!handler) {
    return NextResponse.json(
      { error: `No handler found for path: ${path}` },
      { status: 404 },
    );
  }

  return handler(req, context);
}
