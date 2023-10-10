import { AppContext, Environment } from "../bot.ts";
import { Composer } from "../deps.ts";

export const loggerMiddleware = (environment: Environment) => {
  const composer = new Composer<AppContext>();

  composer
    .filter(() => environment === Environment.Development)
    .use(async (ctx, next) => {
      const id = ctx.update.update_id.toString();
      console.time(id);
      console.log(ctx.update);
      await next();
      console.timeEnd(id);
    });

  return composer;
};
