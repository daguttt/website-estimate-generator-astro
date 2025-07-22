export type ServerError<T extends string> = {
  type: T;
  meta?: Record<string, unknown>;
};
