import { z } from "zod";

const GPTResponseSchema = z.object({
  choices: z.array(
    z.object({
      message: z.object({
        content: z.string(),
      }),
    }),
  ),
});

export async function validateGPTResponse(response: Response): Promise<string> {
  const responseData = await response.json();
  try {
    const parsed = GPTResponseSchema.parse(responseData);
    const content = parsed.choices[0].message.content.trim();
    return content;
  } catch (error) {
    throw new Error(`Invalid API response format, format ${error}`);
  }
}
