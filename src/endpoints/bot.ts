import { webhookCallback } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { getBot } from "../bot.ts";
import { config } from "../config.ts";

export const handleUpdate = webhookCallback(await getBot(config), "std/http", {
  secretToken: config.telegram.secret,
});
