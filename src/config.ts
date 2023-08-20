import "https://deno.land/std@0.167.0/dotenv/load.ts";

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
    endpoint: env("DATABASE_ENDPOINT", ""),
    apiKey: env("DATABASE_API_KEY", ""),
    dataSource: env("DATABASE_DATA_SOURCE", ""),
    dbName: env("DATABASE_NAME", ""),
  },
};

export type AppConfig = typeof config;
