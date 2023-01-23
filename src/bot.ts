import {
  type ConversationFlavor,
  conversations as grammyConversations,
} from "https://deno.land/x/grammy_conversations@v1.1.0/mod.ts";
import { FileAdapter } from "https://deno.land/x/grammy_storages@v2.0.2/file/src/mod.ts";
import {
  Bot,
  Context,
  session,
  SessionFlavor,
} from "https://deno.land/x/grammy@v1.13.1/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

import * as commands from "./commands.ts";
import { AppConfig } from "./config.ts";
import * as conversations from "./conversations.ts";
import * as handlers from "./handlers.ts";
import { qrCodeUrl, QRCodeUrlContext } from "./util/qr-code-url.ts";
import { ISession, MongoDBAdapter } from "./util/storage-adapter.ts";

export type AppSession = {
  pixKey: string;
  city: string;
  name: string;
  query?: string;
};

export type AppContext =
  & Context
  & SessionFlavor<AppSession>
  & ConversationFlavor
  & QRCodeUrlContext;

async function getStorage(config: AppConfig, development = false) {
  if (development) {
    return new FileAdapter<AppSession>({ dirName: "sessions" });
  }

  const client = new MongoClient();
  await client.connect(config.database.uri);
  const db = client.database(config.database.dbName);
  const sessions = db.collection<ISession>("sessions");

  return new MongoDBAdapter<AppSession>({
    collection: sessions,
  });
}

export async function getBot(config: AppConfig, development = false) {
  const bot = new Bot<AppContext>(config.telegram.token);

  if (development) {
    bot.use(async (ctx, next) => {
      console.log(ctx.update);
      await next();
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
