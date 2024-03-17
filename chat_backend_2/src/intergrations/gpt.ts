import { HTTPException } from "hono/http-exception";
import { callGPTAPI } from "./api";
import { retryWrapper } from "./retry";
import { validateGPTResponse } from "./validation";

export async function getGPTAnswer(data: object) {
  try {
    const response = await retryWrapper(() => callGPTAPI(data));
    const message = await validateGPTResponse(response);
    return message;
  } catch {
    throw new HTTPException(503, { message: "GPT integration is down" });
  }
}
