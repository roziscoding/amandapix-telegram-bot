import { webhookCallback } from "grammy/mod.ts";
import { getBot } from "../bot.ts";
import { config } from "../config.ts";

export const handleUpdate = webhookCallback(await getBot(config), "std/http", {
  secretToken: config.telegram.secret,
});
