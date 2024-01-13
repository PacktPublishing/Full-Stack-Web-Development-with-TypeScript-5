import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger as honoLogger } from "hono/logger";
import { timing } from "hono/timing";
import { Pool } from "pg";
import type { ContextVariables } from "../constants";
import { API_PREFIX } from "../constants";
import mainLogger from "../logger";
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

const logger = mainLogger.child({ name: "mainControllr" });
export function createMainApp(
  authApp: Hono<ContextVariables>,
  chatApp: Hono<ContextVariables>,
) {
  const app = new Hono<ContextVariables>().basePath(API_PREFIX);

  app.use("/static/*", serveStatic({ root: "./" }));
  app.use("*", cors());
  app.use("*", timing());
  app.use("*", honoLogger());
  app.use("*", checkJWTAuth);
  app.use("*", attachUserId);

  app.route(AUTH_PREFIX, authApp);
  app.route(CHAT_PREFIX, chatApp);
  showRoutes(app);

  return app;
}

export function createInMemoryApp() {
  logger.debug("Creating an in-memory app");
  return createMainApp(
    createAuthApp(new SimpleInMemoryResource<DBUser, DBCreateUser>()),
    createChatApp(
      new SimpleInMemoryResource<DBChat, DBCreateChat>(),
      new SimpleInMemoryResource<DBMessage, DBCreateMessage>(),
    ),
  );
}

export function createSQLApp() {
  logger.debug("Creating an sql app");
  const pool = new Pool({
    connectionString: Bun.env.DATABASE_URL,
  });
  return createMainApp(
    createAuthApp(new UserSQLResource(pool)),
    createChatApp(new ChatSQLResource(pool), new MessageSQLResource(pool)),
  );
}
export function createORMApp() {
  logger.debug("Creating an orm app");
  const prisma = new PrismaClient();
  return createMainApp(
    createAuthApp(new UserDBResource(prisma)),
    createChatApp(new ChatDBResource(prisma), new MessageDBResource(prisma)),
  );
}
