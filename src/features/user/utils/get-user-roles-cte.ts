import { DrizzleConnection } from "@/db/drizzle/connection";
import { userRoleMembers, userRoles } from "@/db/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export function getUserRolesCTE(db: DrizzleConnection) {
  return db
    .select({
      userId: userRoleMembers.userId,
      roles: sql<
        { id: number; name: string }[] | null
      >`ARRAY_AGG(json_build_object('id', ${userRoles.id}, 'name', ${userRoles.name}))`.as(
        "roles",
      ),
    })
    .from(userRoleMembers)
    .innerJoin(userRoles, eq(userRoleMembers.userRoleId, userRoles.id))
    .groupBy(userRoleMembers.userId)
    .as("userRolesCTE");
}
