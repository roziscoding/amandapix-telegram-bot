import "std/dotenv/load.ts";

function env(name: string, otherwise?: string) {
  const value = Deno.env.get(name) ?? otherwise;
  if (value !== undefined && value !== null) return value;

  throw new Error(`Required environment variable not set: ${name}`);
}

export const config = {
  telegram: {
    token: env("TELEGRAM_TOKEN"),
    secret: env("TELEGRAM_TOKEN").replace(/[^a-zA-Z0-9]/gi, ""),
  },
  webhook: {
    url: env("WEBHOOK_URL", ""),
  },
  database: {
    uri: env("DATABASE_URI", "mongodb://localhost:27017/amandapix"),
    dbName: env("DATABASE_DBNAME", "amandapix"),
  },
};

export type AppConfig = typeof config;
