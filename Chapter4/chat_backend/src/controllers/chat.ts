import { Hono } from "hono";
import type { ContextVariables } from "../constants";
import type {
  DBChat,
  DBCreateChat,
  DBCreateMessage,
  DBMessage,
} from "../models/db";
import type { IDatabaseResource } from "../storage/types";

export const CHAT_PREFIX = "/chat/";
const CHAT_ROUTE = "";
const CHAT_DETAIL_ROUTE = ":id/";
const CHAT_MESSAGE_ROUTE = ":id/message/";
export function createChatApp(
  chatResource: IDatabaseResource<DBChat, DBCreateChat>,
  messageResource: IDatabaseResource<DBMessage, DBCreateMessage>,
) {
  const chatApp = new Hono<ContextVariables>();

  chatApp.post(CHAT_ROUTE, async (c) => {
    const userId = c.get("userId");
    const { name } = await c.req.json();
    const data = await chatResource.create({ name, ownerId: userId });
    return c.json({ data });
  });

  chatApp.get(CHAT_ROUTE, async (c) => {
    const userId = c.get("userId");
    const data = await chatResource.findAll({ ownerId: userId });
    return c.json({ data });
  });

  chatApp.get(CHAT_DETAIL_ROUTE, async (c) => {
    const { id } = c.req.param();
    const userId = c.get("userId");
    const data = await chatResource.find({ id, ownerId: userId });
    return c.json({ data });
  });

  chatApp.get(CHAT_MESSAGE_ROUTE, async (c) => {
    const { id: chatId } = c.req.param();
    const data = await messageResource.findAll({ chatId });
    return c.json({ data });
  });

  chatApp.post(CHAT_MESSAGE_ROUTE, async (c) => {
    const { id: chatId } = c.req.param();
    const { message } = await c.req.json();

    const userMessage: DBCreateMessage = { message, chatId, type: "user" };
    await messageResource.create(userMessage);

    const responseMessage: DBCreateMessage = {
      message: "dummy response",
      chatId,
      type: "user",
    };

    const data = await messageResource.create(responseMessage);

    return c.json({ data });
  });
  return chatApp;
}
