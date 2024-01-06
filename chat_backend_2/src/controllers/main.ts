import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import type { ContextVariables } from "../constants";
import { API_PREFIX } from "../constants";
import { attachUserId, checkJWTAuth } from "../middlewares/auth";
import type {
  DBChat,
  DBCreateChat,
  DBCreateMessage,
  DBCreateUser,
  DBMessage,
  DBUser,
} from "../models/db";
import { SimpleInMemoryResource } from "../storage/in_memory";
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";

export function createMainApp(
  authApp: Hono<ContextVariables>,
  chatApp: Hono<ContextVariables>,
) {
  const app = new Hono<ContextVariables>().basePath(API_PREFIX);

  app.use("/static/*", serveStatic({ root: "./" }));
  app.use("*", cors());
  app.use("*", timing());
  app.use("*", logger());
  app.use("*", checkJWTAuth);
  app.use("*", attachUserId);

  app.route(AUTH_PREFIX, authApp);
  app.route(CHAT_PREFIX, chatApp);
  showRoutes(app);

  return app;
}

export function createInMemoryApp() {
  return createMainApp(
    createAuthApp(new SimpleInMemoryResource<DBUser, DBCreateUser>()),
    createChatApp(
      new SimpleInMemoryResource<DBChat, DBCreateChat>(),
      new SimpleInMemoryResource<DBMessage, DBCreateMessage>(),
    ),
  );
}

// export function createSQLApp() {
//   const pool = new Pool({
//     connectionString: Bun.env.DATABASE_URL,
//   });
//   return createMainApp(
//     createAuthApp(new UserSQLResource(pool)),
//     createChatApp(new ChatSQLResource(pool), new MessageSQLResource(pool)),
//   );
// }
// export function createORMApp() {
//   const prisma = new PrismaClient();
//   return createMainApp(
//     createAuthApp(new UserDBResource(prisma)),
//     createChatApp(new ChatDBResource(prisma), new MessageDBResource(prisma)),
//   );
// }
