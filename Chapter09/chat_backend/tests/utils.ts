import type { PrismaClient } from "@prisma/client";
import type { Pool } from "pg";

export async function resetORMDB(prisma: PrismaClient) {
  await prisma.$transaction([
    prisma.message.deleteMany(),
    prisma.chat.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

export async function resetSQLDB(pg: Pool) {
  await pg.query(
    `DELETE FROM message;
        DELETE FROM chat;
        DELETE FROM "user";`,
  );
}
