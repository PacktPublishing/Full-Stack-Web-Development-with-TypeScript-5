import { Hono } from "hono";
import { env } from "hono/adapter";
import { jwt, sign } from "hono/jwt";
import { API_PREFIX } from "../constants";
import type { DBCreateUser, DBUser } from "../models/db";
import { SimpleInMemoryResource } from "../storage/in_memory";

export const AUTH_PREFIX = "/auth";

export const authApp = new Hono();

const LOGIN_ROUTE = "/login/";
const REGISTER_ROUTE = "/register/";

authApp.use("*", async (c, next) => {
  // allow access to login/register endpoints without jwt tokens
  if (
    c.req.path === API_PREFIX + AUTH_PREFIX + LOGIN_ROUTE ||
    c.req.path === API_PREFIX + AUTH_PREFIX + REGISTER_ROUTE
  ) {
    return await next();
  } else {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    const jwtMiddleware = jwt({
      secret: JWT_SECRET,
    });
    return jwtMiddleware(c, next);
  }
});

authApp.use("*", async (c, next) => {
  // get userPayload from request
  const payload = c.req.context("payload");
  const id = payload.id;
  // set user on the context
  c.context.set("userId", id);
  await next();
});
const userResource = new SimpleInMemoryResource<DBUser, DBCreateUser>();

export const ERROR_USER_ALREADY_EXIST = "USER_ALREADY_EXIST";
authApp.post(REGISTER_ROUTE, async (c) => {
  const { email, password } = await c.req.json();
  if (await userResource.find({ email })) {
    return c.json({ error: ERROR_USER_ALREADY_EXIST }, 400);
  }
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
  });
  await userResource.create({ email, password: hashedPassword });
  return c.json({ success: true });
});

export const ERROR_INVALID_CREDENTIALS = "INVALID_CREDENTIALS";

authApp.post(LOGIN_ROUTE, async (c) => {
  const { email, password } = await c.req.json();
  const fulluser = await userResource.find({ email });
  if (!fulluser || !(await Bun.password.verify(password, fulluser.password))) {
    return c.json({ error: ERROR_INVALID_CREDENTIALS }, 401);
  }

  const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
  const token = await sign({ ...fulluser, password: undefined }, JWT_SECRET);
  return c.json({ token });
});
