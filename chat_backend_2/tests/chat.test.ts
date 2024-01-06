import { beforeEach, describe, expect, test } from "bun:test";
import { createInMemoryApp } from "../src/controllers/main";

describe("chat tests", () => {
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

  async function getToken(email = "test@test.com"): Promise<string> {
    await app.request("/api/v1/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: "password123",
        name: "Chat User",
      }),
    });

    // Login to get the token
    const loginResponse = await app.request("/api/v1/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: "password123",
      }),
    });
    const token = (await loginResponse.json()).token;
    return token!;
  }

  async function createChat(token: string) {
    const createChatResponse = await app.request("/api/v1/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "Test Chat" }),
    });
    const response = await createChatResponse.json();
    const chatId = response.data.id;
    return chatId;
  }

  test("GET /chat/ - get user chats", async () => {
    const token = await getToken();
    const chatId = await createChat(token);
    const response = await app.request("/api/v1/chat/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(200);
    const responseData = await response.json();
    const data = responseData.data;
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(1);
    expect(data[0].id).toBe(chatId);
  });
  test("GET /chat/ - get user chats when multiple chat and users are availalbe", async () => {
    const token = await getToken();
    const token2 = await getToken("email@email.com");
    const chatId = await createChat(token);
    const chatId2 = await createChat(token2);
    const response = await app.request("/api/v1/chat/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).toBe(200);
    const responseData = await response.json();
    const data = responseData.data;
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBe(1);
    expect(data[0].id).toBe(chatId);

    const response2 = await app.request("/api/v1/chat/", {
      method: "GET",
      headers: { Authorization: `Bearer ${token2}` },
    });
    expect(response.status).toBe(200);
    const responseData2 = await response2.json();
    const data2 = responseData2.data;
    expect(Array.isArray(data2)).toBeTruthy();
    expect(data2.length).toBe(1);
    expect(data2[0].id).toBe(chatId2);
  });

  test("GET /chat/:id/message/ - get chat messages", async () => {
    const token = await getToken();
    const chatId = await createChat(token);
    await app.request(`/api/v1/chat/${chatId}/message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message: "Hello World" }),
    });

    const response = await app.request(`/api/v1/chat/${chatId}/message/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).toBe(200);
    const messages = await response.json();
    expect(messages.data).toBeInstanceOf(Array);
    expect(messages.data.length).toBe(2);
  });
});
