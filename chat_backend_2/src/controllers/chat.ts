import { Hono } from "hono";
import type {
  DBChat,
  DBCreateChat,
  DBCreateMessage,
  DBMessage,
} from "../models/db";
import { SimpleInMemoryResource } from "../storage/in_memory";

export const CHAT_PREFIX = "/chat";

export const chatApp = new Hono();

const CHAT_ROUTE = "/chat/";
const CHAT_MESSAGE_ROUTE = "/chat/:id/message";

const chatResource = new SimpleInMemoryResource<DBChat, DBCreateChat>();
const messageResource = new SimpleInMemoryResource<
  DBMessage,
  DBCreateMessage
>();
chatApp.get(CHAT_ROUTE, async (c) => {
  const { userId } = await c.req.context;
  const data = await chatResource.findAll({ ownerId: userId });
  return c.json({ data });
});

chatApp.get(CHAT_MESSAGE_ROUTE, async (c) => {
  // get correctly from path
  const { id: chatId } = c.req.param();
  const data = await messageResource.findAll({ chatId });
  return c.json({ data });
});

chatApp.post(CHAT_MESSAGE_ROUTE, async (c) => {
  // get correctly from path
  const { id: chatId } = c.req.param();
  // validate
  const { message } = await c.req.json();

  const userMessage: DBCreateMessage = { message, chatId, type: "user" };
  await messageResource.create(userMessage);

  const responseMessage: DBCreateMessage = {
    message: "dummy response",
    chatId,
    type: "user",
  };

  const data = await messageResource.create(responseMessage);

  return c.json({ data: responseMessage });
});
