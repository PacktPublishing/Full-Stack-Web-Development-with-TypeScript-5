import type { Context } from "hono";
import type { ContextVariables } from "../constants";
import mainLogger from "../logger";

interface CacheEntry {
  body: any;
  expiration: number;
}

const logger = mainLogger.child({ name: "cacheMiddleware" });
export const cacheMiddleware = () => {
  const cache = new Map<string, CacheEntry>();

  return async (c: Context<ContextVariables>, next: () => Promise<void>) => {
    const userId = c.get("userId");
    const path = c.req.path;
    const cacheKey = `${path}:${userId}`;

    c.set("cache", {
      cache: (body: object, expiration: number = 3600) => {
        const expireAt = Date.now() + expiration * 1000;
        const entry = { body, expiration: expireAt };
        logger.info(
          `Setting cache key: ${cacheKey}, to${JSON.stringify(entry)}`,
        );
        cache.set(cacheKey, entry);
      },
      clear: () => {
        logger.info(`Clearing cache key: ${cacheKey}`);
        cache.delete(cacheKey);
      },
      clearPath: (path: string) => {
        const fullKey = `${path}:${userId}`;
        logger.info(`Clearing cache key: ${fullKey}`);
        cache.delete(fullKey);
      },
    });

    if (c.req.method.toUpperCase() === "GET") {
      const cacheEntry = cache.get(cacheKey);
      if (cacheEntry) {
        logger.debug(
          `Found cache entry: ${cacheKey}, to${JSON.stringify(cacheEntry)}`,
        );
        if (cacheEntry.expiration > Date.now()) {
          logger.debug(
            `return from key: ${cacheKey}, body: ${JSON.stringify(
              cacheEntry.body,
            )}`,
          );
          return c.json(cacheEntry.body);
        } else {
          logger.debug(
            `Cache entry expired cache key: ${cacheKey}, expiration: ${cacheEntry?.expiration}`,
          );
        }
      }
    }

    await next();
  };
};
