import type { Pool } from "pg";

export async function resetSQLDB(pg: Pool) {
  await pg.query(
    `
      DELETE FROM message;
      DELETE FROM chat;
      DELETE FROM "user";`,
  );
}
