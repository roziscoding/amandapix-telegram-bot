import { Environment, getBot } from "./src/bot.ts";
import { config } from "./src/config.ts";

const bot = await getBot(config, Environment.Development);

bot.use(async (ctx, next) => {
  console.log(JSON.stringify(ctx.update));
  await next();
});

bot.start({
  onStart: ({ username }) => {
    console.log(`Bot listening via polling as @${username}`);
  },
  allowed_updates: ["message", "inline_query", "callback_query"],
}).catch((err) => {
  console.error(err);
  Deno.exit(1);
});
