import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { z } from "zod";
import { apiRegistry } from "./api-registry";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface CreateServerApiOptions<TInput, TOutput> {
  /**
   * The server action to wrap
   */
  action: (input: TInput) => Promise<TOutput>;
  /**
   * The path for the API endpoint
   * @example "/users/get-by-id"
   */
  path: string;
  /**
   * Input validation schema
   */
  inputSchema?: z.ZodType<TInput>;
}

/**
 * Creates a server API endpoint from a server action and automatically registers it
 * @example
 * ```ts
 * // src/features/user/actions/get-user-by-id/index.ts
 * import { createServerApi } from "@/lib/utils/create-server-api";
 * import { z } from "zod";
 *
 * const { api: getUserById } = createServerApi<GetUserByIdParams, GetUserByIdResponse>({
 *   action: async (params) => {
 *     // ... implementation
 *   },
 *   path: "/users/get-by-id",
 *   inputSchema: z.object({
 *     id: z.string(),
 *   }),
 * });
 * ```
 */
export function createServerApi<TInput, TOutput>({
  action,
  path,
  inputSchema,
}: CreateServerApiOptions<TInput, TOutput>) {
  // Create the API handler
  const handler = async (req: NextRequest) => {
    try {
      // Only allow POST method for all endpoints
      if (req.method !== "POST") {
        return NextResponse.json(
          { error: "Only POST method is allowed" },
          { status: 405 },
        );
      }

      let input: any;

      try {
        // Parse JSON body
        const body = await req.json();
        input = body;
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 },
        );
      }

      // Validate input if schema is provided
      if (inputSchema) {
        const result = inputSchema.safeParse(input);
        if (!result.success) {
          return NextResponse.json(
            { error: "Invalid input", details: result.error.format() },
            { status: 400 },
          );
        }
        input = result.data;
      }

      // Execute the server action
      const output = await action(input as TInput);

      return NextResponse.json(output);
    } catch (error: any) {
      console.error("API Error:", error);
      return NextResponse.json(
        { error: error?.message || "Internal server error" },
        { status: 500 },
      );
    }
  };

  // Register the handler
  apiRegistry.register(path, handler);

  // Create the cached client-side API function
  const api = cache(async (input: TInput) => {
    return (await fetch(`/api${path}`, {
      method: "POST",
      body: JSON.stringify(input),
    }).then((res) => res.json())) as TOutput;
  });

  // Return both the server action and the client-side API function
  return {
    action,
    endpoint: path,
    api,
  };
}
