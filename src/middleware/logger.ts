import { AppContext, Environment } from "../bot.ts";
import { AppConfig } from "../config.ts";
import { Axiom, Composer } from "../deps.ts";

export const loggerMiddleware = (environment: Environment, config: AppConfig) => {
  const composer = new Composer<AppContext>();
  const axiom = new Axiom({
    token: config.AXIOM_TOKEN,
  });

  composer
    .filter(() => environment === Environment.Development)
    .use(async (ctx, next) => {
      const id = crypto.randomUUID();
      console.time(id);
      console.log('Processing update', ctx.update.update_id)
      const logInfo: Record<string, unknown> = {
        id: crypto.randomUUID(),
        start: new Date().toISOString(),
        update: ctx.update,
        environment,
      };

      try {
        await next();
        logInfo.result = "success";
      } catch (error) {
        logInfo.result = "error";
        logInfo.error = error;
        console.error(`Update ${ctx.update.update_id} failed. Error: ${error}`);
      } finally {
        logInfo.end = new Date().toISOString();
        console.timeEnd(id);
        axiom.ingest(config.AXIOM_DATASET, [logInfo]);
        await axiom.flush();
      }
    });

  return composer;
};
