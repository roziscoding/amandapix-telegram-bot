import { commands } from "./commands.ts";
import { AppConfig } from "./config.ts";
import conversations from "./conversations.ts";
import { Bot, Context, type ConversationFlavor, conversations as grammyConversations, SessionFlavor } from "./deps.ts";
import { SerializedGroup } from "./domain/Group.ts";
import handlers from "./handlers.ts";
import groupInstance, { GroupFlavor } from "./middleware/group-instance.ts";
import { loggerMiddleware } from "./middleware/logger.ts";
import { sessionMiddleware } from "./middleware/session.ts";
import { qrCodeUrl, QRCodeUrlFlavor } from "./util/qr-code-url.ts";

export type AppSession = {
  pixKey: string;
  city: string;
  name: string;
  query?: string;
  group?: SerializedGroup;
};

export type AppContext =
  & Context
  & ConversationFlavor
  & SessionFlavor<AppSession>
  & QRCodeUrlFlavor
  & GroupFlavor;

export enum Environment {
  Development = "development",
  Production = "production",
}

export async function getBot(config: AppConfig, environment = Environment.Development) {
  const bot = new Bot<AppContext>(config.TELEGRAM_TOKEN);

  /** Common middleware */
  bot.use(loggerMiddleware(environment));
  bot.use(sessionMiddleware(config, environment));
  bot.use(qrCodeUrl);
  bot.use(groupInstance);

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
