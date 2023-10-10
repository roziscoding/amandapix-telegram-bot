import { Environment, getBot } from "../bot.ts";
import { config } from "../config.ts";
import { webhookCallback } from "../deps.ts";

export const handleUpdate = webhookCallback(await getBot(config, Environment.Production), "std/http", {
  secretToken: config.WEBHOOK_SECRET,
});
