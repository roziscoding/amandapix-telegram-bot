import { Environment, getBot } from "./src/bot.ts";
import { config } from "./src/config.ts";

const bot = await getBot(config, Environment.Development);

bot.start({
  onStart: ({ username }) => {
    console.log(`Bot listening via polling as @${username}`);
  },
  allowed_updates: ["message", "inline_query", "callback_query", "my_chat_member", "chat_member"],
}).catch((err) => {
  console.error(err);
  Deno.exit(1);
});
