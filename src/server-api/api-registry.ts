import { NextRequest } from "next/server";

type ApiHandler = (
  req: NextRequest,
  context: { params: any },
) => Promise<Response>;

interface ApiEndpoint {
  handler: ApiHandler;
  path: string;
}

class ApiRegistry {
  private static instance: ApiRegistry;
  private endpoints: Map<string, ApiEndpoint> = new Map();

  private constructor() {}

  static getInstance(): ApiRegistry {
    if (!ApiRegistry.instance) {
      ApiRegistry.instance = new ApiRegistry();
    }
    return ApiRegistry.instance;
  }

  register(path: string, handler: ApiHandler) {
    // Normalize the path to ensure consistent format
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    this.endpoints.set(normalizedPath, { handler, path: normalizedPath });
  }

  getHandler(path: string): ApiHandler | undefined {
    const endpoint = this.endpoints.get(path);
    return endpoint?.handler;
  }

  getAllEndpoints(): ApiEndpoint[] {
    return Array.from(this.endpoints.values());
  }
}

export const apiRegistry = ApiRegistry.getInstance();
