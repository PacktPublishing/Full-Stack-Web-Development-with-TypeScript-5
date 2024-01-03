import { expect, test } from "bun:test";
import app from "../src";

test("POST /message is ok", async () => {
  const req = new Request("Hello!", {
    method: "POST",
  });
  const res = await app.request(req);
  expect(res.status).toBe(201);
});
