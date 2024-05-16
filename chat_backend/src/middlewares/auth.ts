import type { Context } from "hono";
import { env } from "hono/adapter";
import { jwt } from "hono/jwt";
import { API_PREFIX } from "../constants";
import { AUTH_PREFIX, LOGIN_ROUTE, REGISTER_ROUTE } from "../controllers/auth";
import type { APIUser } from "../models/api";

export async function checkJWTAuth(
  c: Context,
  next: () => Promise<void>,
): Promise<Response | void> {
  // allow access to login/register endpoints without jwt tokens
  if (
    c.req.path === API_PREFIX + AUTH_PREFIX + LOGIN_ROUTE ||
    c.req.path === API_PREFIX + AUTH_PREFIX + REGISTER_ROUTE
  ) {
    return await next();
  } else {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }, typeof c>(c);
    const jwtMiddleware = jwt({
      secret: JWT_SECRET,
    });
    return jwtMiddleware(c, next);
  }
}

export async function attachUserId(
  c: Context,
  next: () => Promise<void>,
): Promise<Response | void> {
  const payload = c.get("jwtPayload") as APIUser;
  if (payload) {
    const id = payload.id;
    c.set("userId", id);
  }
  await next();
}
