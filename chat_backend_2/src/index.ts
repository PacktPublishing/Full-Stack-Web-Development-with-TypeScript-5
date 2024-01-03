import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { API_PREFIX } from "./constants";
import { AUTH_PREFIX, authApp } from "./controllers/auth";

const app = new Hono().basePath(API_PREFIX);

app.use("/static/*", serveStatic({ root: "./" }));
app.use("*", cors());
app.use("*", timing());
app.use("*", logger());
app.route(AUTH_PREFIX, authApp);

showRoutes(app);
export default app;
