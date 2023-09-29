import "https://deno.land/std@0.167.0/dotenv/load.ts";
import { z } from "./deps.ts";

const AppConfig = z.object({
  TELEGRAM_TOKEN: z.string(),
  WEBHOOK_URL: z.string(),
  DATABASE_ENDPOINT: z.string().url(),
  DATABASE_API_KEY: z.string(),
  DATABASE_DATASOURCE: z.string(),
  DATABASE_DBNAME: z.string(),
}).transform((obj) => ({
  ...obj,
  WEBHOOK_SECRET: obj.TELEGRAM_TOKEN.replace(/[^a-zA-Z0-9]/gi, ""),
}));

export const config = AppConfig.parse(Deno.env.toObject());

export type AppConfig = z.infer<typeof AppConfig>;
