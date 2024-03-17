import type { Context } from "hono";
import type { ContextVariables } from "../constants";

const requestCounts = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS = 100; // Max requests per window per client
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
export const rateLimitMiddleware = async (
  c: Context<ContextVariables>,
  next: Function,
) => {
  const userId = c.get("userId");
  if (!userId) {
    await next();
    return;
  }
  const now = Date.now();
  let requestData = requestCounts.get(userId);

  if (!requestData) {
    requestData = { count: 1, resetTime: now + WINDOW_SIZE_MS };
    requestCounts.set(userId, requestData);
  } else {
    if (requestData.resetTime < now) {
      requestData.count = 1;
      requestData.resetTime = now + WINDOW_SIZE_MS;
    } else {
      requestData.count += 1;
    }
  }

  if (requestData.count > MAX_REQUESTS) {
    return c.text("Rate limit exceeded. Try again later.", 429);
  } else {
    requestCounts.set(userId, requestData);
    await next();
  }
};
