import "https://lib.deno.dev/std@0.167/dotenv/load.ts";
import { z } from "./deps.ts";

const AppConfig = z.object({
  TELEGRAM_TOKEN: z.string(),
  WEBHOOK_URL: z.string().url().default(""),
}).transform((obj) => ({
  ...obj,
  WEBHOOK_URL: new URL(obj.WEBHOOK_URL),
  WEBHOOK_SECRET: obj.TELEGRAM_TOKEN.replace(/[^a-zA-Z0-9]/gi, ""),
}));

export const config = AppConfig.parse(Deno.env.toObject());

export type AppConfig = z.infer<typeof AppConfig>;
