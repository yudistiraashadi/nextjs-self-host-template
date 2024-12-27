import {
  bigint,
  jsonb,
  pgSchema,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Auth Schema
 */
export const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  rawAppMetaData: jsonb("raw_app_meta_data"),
  rawUserMetaData: jsonb("raw_user_meta_data"),
});

/**
 * Public Schema
 */
// USERS
export const userRoles = pgTable("user_roles", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  name: text("name").notNull(),
});

export const userProfiles = pgTable("user_profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  name: text("name"),
});

export const userRoleMembers = pgTable("user_role_members", {
  id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => authUsers.id),
  userRoleId: smallint("user_role_id")
    .notNull()
    .references(() => userRoles.id),
});
// END OF USERS
