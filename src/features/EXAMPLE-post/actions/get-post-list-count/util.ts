import { postListValidColumns } from "@/features/EXAMPLE-post/actions/get-post-list/util";
import { z } from "zod";

export const getPostListCountParamsSchema = z.object({
  search: z.string().optional(),
  columnFilters: z
    .array(z.object({ id: z.enum(postListValidColumns), value: z.string() }))
    .optional(),
});
