import {
  Bot,
  Context,
  type ConversationFlavor,
  conversations as grammyConversations,
  FileAdapter,
  MongoClient,
  session,
  SessionFlavor,
} from "./deps.ts";

import * as commands from "./commands.ts";
import { AppConfig } from "./config.ts";
import * as conversations from "./conversations.ts";
import * as handlers from "./handlers.ts";
import { qrCodeUrl, QRCodeUrlFlavor } from "./util/qr-code-url.ts";
import { ISession, MongoDBAdapter } from "./util/storage-adapter.ts";

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

function getStorage(config: AppConfig, development = false) {
  if (development) {
    return new FileAdapter<AppSession>({ dirName: "sessions" });
  }

  const client = new MongoClient({
    dataSource: config.DATABASE_DATASOURCE,
    endpoint: config.DATABASE_ENDPOINT,
    auth: {
      apiKey: config.DATABASE_API_KEY,
    },
  });

  const db = client.database(config.DATABASE_DBNAME);
  const sessions = db.collection<ISession>("sessions");

  return new MongoDBAdapter<AppSession>({
    collection: sessions,
  });
}

export async function getBot(config: AppConfig, development = false) {
  const bot = new Bot<AppContext>(config.TELEGRAM_TOKEN);

  if (development) {
    bot.use(async (ctx, next) => {
      console.time("update");
      console.log(ctx.update);
      await next();
      console.timeEnd("update");
    });
  }

  bot.use(qrCodeUrl(config));

  bot.use(
    session({
      getSessionKey: (ctx) => ctx.from?.id.toString(),
      initial: () => ({
        pixKey: "",
        city: "",
        name: "",
      }),
      storage: await getStorage(config, development),
    }),
  );

  bot.use(grammyConversations());

  /** Cancel Command */
  bot.command(commands.cancel.name, commands.cancel.fn);

  /** Conversations */
  for (const conversation of Object.values(conversations)) {
    bot.use(conversation);
  }

  /** Regular commands */
  for (const command of Object.values(commands)) {
    if (command.name === "cancel") continue;
    bot.command(command.name, command.fn);
  }

  /** Inline query handlers */
  for (const handler of Object.values(handlers)) {
    handler.install(bot);
  }

  bot.catch(console.error);

  return bot;
}
