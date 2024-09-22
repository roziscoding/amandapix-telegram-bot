/// <reference lib="deno.unstable" />
import { commands, priorityCommands, setMyCommands } from "./commands.ts";
import { AppConfig } from "./config.ts";
import conversations from "./conversations.ts";
import { Bot, Context, type ConversationFlavor, conversations as grammyConversations, SessionFlavor } from "./deps.ts";
import handlers from "./handlers.ts";
import { loggerMiddleware } from "./middleware/logger.ts";
import { sessionMiddleware } from "./middleware/session.ts";
import { qrCodeUrl, QRCodeUrlFlavor } from "./util/qr-code-url.ts";

export type AppSession = {
  pixKey: string;
  city: string;
  name: string;
  query?: string;
  onboarded?: boolean;
};

export type AppContext =
  & Context
  & ConversationFlavor
  & SessionFlavor<AppSession>
  & QRCodeUrlFlavor;

export enum Environment {
  Development = "development",
  Production = "production",
}

export async function getBot(
  config: AppConfig,
  environment = Environment.Development,
) {
  const bot = new Bot<AppContext>(config.TELEGRAM_TOKEN);
  const kv = await Deno.openKv(
    environment === Environment.Development ? "./db" : undefined,
  );

  /** Common middleware */
  bot.use(loggerMiddleware(environment));
  bot.use(sessionMiddleware(kv));
  bot.use(qrCodeUrl);

  /** Conversations */
  bot.use(grammyConversations());
  bot.use(priorityCommands);
  bot.use(conversations);

  /** Commands */
  bot.use(commands);
  await setMyCommands(bot);

  /** Query Handlers */
  bot.use(handlers);

  bot.catch(console.error);

  return bot;
}
