import * as schema from "@/db/drizzle/schema";
import { env } from "@/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let connection: postgres.Sql;

const globalConnection = global as typeof globalThis & {
  connection: postgres.Sql;
};

const dbDefaultConfig = {
  schema,
};

export type DrizzleConnection = ReturnType<typeof drizzle>;

export function createDrizzleConnection(config = dbDefaultConfig) {
  if (!globalConnection.connection) {
    globalConnection.connection = postgres(env.DATABASE_URL, {
      prepare: false,
    });
  }

  connection = globalConnection.connection;

  return drizzle({
    client: connection,
    schema: config.schema,
  });
}
