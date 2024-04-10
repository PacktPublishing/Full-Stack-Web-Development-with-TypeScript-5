import { PrismaClient } from "@prisma/client";

import { Hono } from "hono";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { Pool } from "pg";
import type { ContextVariables } from "../constants";
import { API_PREFIX } from "../constants";
import { attachUserId, checkJWTAuth } from "../middlewares/auth";
import { cacheMiddleware } from "../middlewares/cacheMiddleware";
import { rateLimitMiddleware } from "../middlewares/rateLimiting";
import type {
  DBChat,
  DBCreateChat,
  DBCreateMessage,
  DBCreateUser,
  DBMessage,
  DBUser,
} from "../models/db";
import { SimpleInMemoryResource } from "../storage/in_memory";
import {
  ChatDBResource,
  MessageDBResource,
  UserDBResource,
} from "../storage/orm";
import {
  ChatSQLResource,
  MessageSQLResource,
  UserSQLResource,
} from "../storage/sql";
import { AUTH_PREFIX, createAuthApp } from "./auth";
import { CHAT_PREFIX, createChatApp } from "./chat";

const corsOptions = {
  origin: [Bun.env.CORS_ORIGIN as string],
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};
export function createMainApp(
  authApp: Hono<ContextVariables>,
  chatApp: Hono<ContextVariables>,
) {
  const app = new Hono<ContextVariables>().basePath(API_PREFIX);

  app.use("*", cors(corsOptions));
  app.use("*", timing());
  app.use("*", logger());
  app.use("*", checkJWTAuth);
  app.use("*", attachUserId);
  app.use("*", rateLimitMiddleware);
  app.use("*", cacheMiddleware());

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

export function createSQLApp() {
  const pool = new Pool({
    connectionString: Bun.env.DATABASE_URL,
  });
  return createMainApp(
    createAuthApp(new UserSQLResource(pool)),
    createChatApp(new ChatSQLResource(pool), new MessageSQLResource(pool)),
  );
}
export function createORMApp() {
  const prisma = new PrismaClient();
  prisma.$connect();
  return createMainApp(
    createAuthApp(new UserDBResource(prisma)),
    createChatApp(new ChatDBResource(prisma), new MessageDBResource(prisma)),
  );
}
