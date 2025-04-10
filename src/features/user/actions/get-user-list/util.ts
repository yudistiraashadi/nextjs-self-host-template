import { z } from "zod";

export const userListValidColumns = [
  "name",
  "email",
  "role",
  "status",
] as const;

export const getUserListParamsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().positive().default(1),
  pageSize: z.coerce.number().positive().default(10),
  columnFilters: z
    .array(z.object({ id: z.enum(userListValidColumns), value: z.string() }))
    .optional(),
  sorting: z
    .array(z.object({ id: z.enum(userListValidColumns), desc: z.boolean() }))
    .optional(),
});
