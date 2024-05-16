import type { DBMessage } from "../models/db";
import { getGPTAnswer } from "./gpt";

export async function generateMessageResponse(
  messages: DBMessage[],
): Promise<string> {
  const params = {
    model: "gpt-3.5-turbo-0125",
    temperature: 0,
    max_tokens: 1000,
    top_p: 1,
    n: 1,
    stream: false,
    stop: "",
  };
  const data = {
    ...params,
    messages: [
      {
        role: "system",
        content: `You are a helpful AI assistant who answers to the user messages`,
      },
      ...messages.map((m) => ({ role: m.type, content: m.message })),
    ],
  };
  return getGPTAnswer(data);
}
