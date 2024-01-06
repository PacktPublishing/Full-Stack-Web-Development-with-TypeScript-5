import { beforeEach, describe, expect, test } from "bun:test";
import { createInMemoryApp } from "../src/controllers/main";

describe("auth tests", () => {
  let app = createInMemoryApp();

  // const app = createSQLApp();
  // const pool = new Pool({
  //   connectionString: Bun.env.DATABASE_URL,
  // });

  // const app = createORMApp();
  // const prisma = new PrismaClient();

  beforeEach(async () => {
    app = createInMemoryApp();
    // await resetSQLDB(pool);
    // await resetORMDB(prisma);
  });
  test("POST1 /register - normal case", async () => {
    const jsonBody = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    const response = await app.request("/api/v1/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonBody),
    });

    expect(response.status).toBe(200);
  });

  test("POST /register - user already exists", async () => {
    // First create a user
    await app.request("/api/v1/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "existing@example.com",
        password: "password123",
        name: "Existing User",
      }),
    });

    // Attempt to create the same user again
    const response = await app.request("/api/v1/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "existing@example.com",
        password: "password123",
        name: "Existing User",
      }),
    });
    expect(response.status).toBe(400);
  });
  test("POST /login - success", async () => {
    // protected routes are prohibited
    const res1 = await app.request("/api/v1/chat/", { method: "GET" });
    expect(res1.status).toBe(401);

    // create a user first
    await app.request("/api/v1/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "loginuser@example.com",
        password: "password123",
        name: "Login User",
      }),
    });

    // Attempt to login
    const loginResponse = await app.request("/api/v1/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "loginuser@example.com",
        password: "password123",
      }),
    });
    expect(loginResponse.status).toBe(200);
    const token = (await loginResponse.json())["token"];
    expect(token).toBeTruthy();

    // try to access a protected route, now available
    const res2 = await app.request("/api/v1/chat/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res2.status).toBe(200);
  });

  test("POST /login - non-existing user", async () => {
    const response = await app.request("/api/v1/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "nonexisting@example.com",
        password: "password123",
      }),
    });
    expect(response.status).toBe(401);
  });
});
