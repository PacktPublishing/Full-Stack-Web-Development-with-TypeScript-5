import { Hono } from "hono";
import { logger } from "hono/logger";
import { timing } from "hono/timing";

const app = new Hono();
app.use("*", timing());
app.use("*", logger());

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});
console.log(Bun.env.TEST);
console.log(Bun.env.TEST2);
console.log(Bun.env.TEST3);
export default app;
