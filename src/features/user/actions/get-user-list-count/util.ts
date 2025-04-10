import { userListValidColumns } from "@/features/user/actions/get-user-list/util";
import { z } from "zod";

export const getUserListCountParamsSchema = z.object({
  search: z.string().optional(),
  columnFilters: z
    .array(z.object({ id: z.enum(userListValidColumns), value: z.string() }))
    .optional(),
});
