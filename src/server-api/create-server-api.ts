import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { z } from "zod";
import { apiRegistry } from "./api-registry";

interface CreateServerApiOptions<TInput extends z.ZodType<any>, TOutput> {
  /**
   * The path for the API endpoint
   * @example "/users/get-by-id"
   */
  path: string;
  /**
   * Input validation schema (optional)
   * If not provided, the API will accept empty input
   */
  inputSchema?: TInput;
  /**
   * The function to wrap
   */
  function: (
    input: TInput extends z.ZodType<infer U> ? U : never,
  ) => Promise<TOutput>;
}

// Helper function to check if all fields in a schema are optional
function isAllFieldsOptional(schema: z.ZodType<any>): boolean {
  if (schema instanceof z.ZodObject) {
    const shape = (schema as any)._def.shape();
    return Object.values(shape).every(
      (field: any) =>
        field instanceof z.ZodOptional ||
        (field instanceof z.ZodObject && isAllFieldsOptional(field)),
    );
  }
  return false;
}

/**
 * Creates a server API endpoint from a server function and automatically registers it
 *
 * @param function - The server function to wrap
 * @param path - The path for the API endpoint. make sure it's unique
 * @param inputSchema - The input validation schema using zod (optional if no input is needed)
 *
 * @example
 * ```ts
 * // With input schema
 * export const getUserById = createServerApi({
 *   function: async (params) => {
 *     // ... implementation
 *     return { user: { id: params.id, name: "John Doe" } };
 *   },
 *   path: "/users/get-by-id",
 *   inputSchema: z.object({
 *     id: z.string(),
 *   }),
 * });
 *
 * // Without input schema
 * export const getAllUsers = createServerApi({
 *   function: async () => {
 *     // ... implementation returning all users
 *     return [{ id: "123", name: "John Doe" }];
 *   },
 *   path: "/users/get-all",
 * });
 * ```
 */
export function createServerApi<
  TSchema extends z.ZodType<any> = z.ZodType<never>,
  TOutput = any,
>({
  function: fn,
  path,
  inputSchema,
}: Omit<CreateServerApiOptions<TSchema, TOutput>, "inputSchema"> & {
  inputSchema?: TSchema;
}) {
  // Default empty schema
  const schema =
    inputSchema || (z.object({} as never).optional() as unknown as TSchema);

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

      let input: any = {};

      try {
        // Parse JSON body if content exists
        const text = await req.text();
        if (text) {
          input = JSON.parse(text);
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 },
        );
      }

      // Validate input if schema is provided
      const isOptionalSchema = isAllFieldsOptional(schema);
      if (!isOptionalSchema || Object.keys(input).length > 0) {
        const result = schema.safeParse(input);
        if (!result.success) {
          return NextResponse.json(
            { error: "Invalid input", details: result.error.format() },
            { status: 400 },
          );
        }
        input = result.data;
      }

      // Execute the server function
      const output = await fn(input);

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

  // Create the type-safe client function
  const clientFn = async (input: z.input<TSchema> = {} as z.input<TSchema>) => {
    if (typeof window === "undefined") {
      return fn(input) as TOutput;
    }

    try {
      const response = await fetch(`/api/server${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Request failed with status ${response.status}`,
        );
      }

      return (await response.json()) as TOutput;
    } catch (error) {
      console.error(`API request to ${path} failed:`, error);
      throw error;
    }
  };

  // return API function with proper typing
  return cache(clientFn);
}
