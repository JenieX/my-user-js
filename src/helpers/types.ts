export interface FishOptions extends RequestInit {
  timeOut?: 10_000 | 30_000 | 60_000 | 120_000,
}

export type FishReturn = Promise<{
  response: Response,
  abortTimeOut: NodeJS.Timeout | undefined,
}>;
