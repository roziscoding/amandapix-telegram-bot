import { commands } from "./commands.ts";
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

export async function getBot(config: AppConfig, environment = Environment.Development) {
  const bot = new Bot<AppContext>(config.TELEGRAM_TOKEN);

  /** Common middleware */
  bot.use(loggerMiddleware(environment));
  bot.use(sessionMiddleware(config, environment));
  bot.use(qrCodeUrl(config));

  /** Conversations */
  bot.use(grammyConversations());
  bot.use(conversations);

  /** Commands */
  bot.use(commands);
  await commands.setCommands(bot);

  /** Query Handlers */
  bot.use(handlers);

  bot.catch(console.error);

  return bot;
}
