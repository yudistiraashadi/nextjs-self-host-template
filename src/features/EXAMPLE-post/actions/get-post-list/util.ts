import { z } from "zod";

export const postListValidColumns = [
  "title",
  "content",
  "isProtected",
] as const;

export const getPostListParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(10),
  columnFilters: z
    .array(z.object({ id: z.enum(postListValidColumns), value: z.string() }))
    .optional(),
  sorting: z
    .array(z.object({ id: z.enum(postListValidColumns), desc: z.boolean() }))
    .optional(),
});
