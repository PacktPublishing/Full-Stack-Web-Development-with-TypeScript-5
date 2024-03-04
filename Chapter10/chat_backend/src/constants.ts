export const API_PREFIX = "/api/v1";

export type ContextVariables = {
  Variables: {
    userId: string;
    cache: {
      cache: (body: object, expiration?: number) => void;
      clear: () => void;
      clearPath: (path: string) => void;
    };
  };
};
