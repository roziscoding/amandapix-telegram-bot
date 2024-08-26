import { AppContext, AppSession, Environment } from "../bot.ts";
import { AppConfig } from "../config.ts";
import { FileAdapter, MongoClient, session } from "../deps.ts";
import { ISession, MongoDBAdapter } from "../util/storage-adapter.ts";

function getStorage(config: AppConfig, environment = Environment.Development) {
  if (environment === Environment.Development) {
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

export const sessionMiddleware = (config: AppConfig, environment: Environment) =>
  session<AppSession, AppContext>({
    getSessionKey: (ctx) => ctx.from?.id.toString(),
    initial: () => ({
      pixKey: "",
      city: "",
      name: "",
      onboarded: false,
    }),
    storage: getStorage(config, environment),
  });
