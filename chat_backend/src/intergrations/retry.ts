export async function retryWrapper(
  fn: () => Promise<Response>,
  retryCount: number = 3,
): Promise<Response> {
  async function attempt() {
    try {
      const result = await fn();
      if (!result.ok) {
        throw new Error(`Request failed with status ${result.status}`);
      }
      return result;
    } catch (error: unknown) {
      if (retryCount > 0) {
        retryCount--;
        return attempt();
      } else {
        throw new Error(
          `Api calls failed after retries: ${(error as Error)?.message}`,
        );
      }
    }
  }
  return attempt();
}
