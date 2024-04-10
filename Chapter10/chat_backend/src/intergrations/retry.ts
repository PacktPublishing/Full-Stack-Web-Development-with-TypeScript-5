export async function retryWrapper(
    fn: () => Promise<Response>,
    retryCount: number = 3,
    delayMs: number = 1000,
): Promise<Response> {
  async function attempt(attemptNumber: number = 1): Promise<Response> {
    try {
      const result = await fn();
      if (!result.ok) {
        throw new Error(`Request failed with status ${result.status}`);
      }
      return result;
    } catch (error: unknown) {
      if (retryCount > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attemptNumber - 1)));
        retryCount--;
        return attempt(attemptNumber + 1);
      } else {
        throw new Error(
            `API calls failed after retries: ${(error as Error)?.message}`,
        );
      }
    }
  }
  return attempt();
}
