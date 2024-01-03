import type { Email } from "./utils";

export interface DBEntity {
  id: string;
  createdAt: number;
  updatedAt: number;
}

export interface DBUser extends DBEntity {
  name: string;
  email: Email;
  password: string;
}

export interface DBChat extends DBEntity {
  ownerId: DBUser["id"];
  name: string;
}

export type MessageType = "system" | "user";

export interface DBMessage extends DBEntity {
  chatId: DBChat["id"];
  type: MessageType;
  message: string;
}

export type DBCreateUser = Pick<DBUser, "email" | "password">;
export type DBCreateChat = Pick<DBChat, "name">;
export type DBCreateMessage = Pick<DBMessage, "chatId" | "message" | "type">;
