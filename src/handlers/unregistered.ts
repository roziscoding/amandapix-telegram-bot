import { AppContext } from "../bot.ts";
import { Bot } from "../deps.ts";

export function install(bot: Bot<AppContext>) {
  bot
    .filter((ctx) => !ctx.session.pixKey)
    .inlineQuery(/[\d.,]+/gi, (ctx) =>
      ctx.answerInlineQuery([], {
        button: { text: "Clique aqui pra se cadastrar", start_parameter: ctx.inlineQuery.query },
        cache_time: 0,
      }));
}
