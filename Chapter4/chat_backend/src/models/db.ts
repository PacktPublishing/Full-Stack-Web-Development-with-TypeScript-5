export type Email = `${string}@${string}.${string}`;

export interface DBEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
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

export type MessageType = "assistant" | "user";

export interface DBMessage extends DBEntity {
  chatId: DBChat["id"];
  type: MessageType;
  message: string;
}

export type DBCreateUser = Pick<DBUser, "email" | "password" | "name">;
export type DBCreateChat = Pick<DBChat, "name" | "ownerId">;
export type DBCreateMessage = Pick<DBMessage, "chatId" | "message" | "type">;
