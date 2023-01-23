import { Bot } from "https://deno.land/x/grammy@v1.13.1/mod.ts";
import { AppContext } from "../bot.ts";

export function install(bot: Bot<AppContext>) {
  bot
    .filter((ctx) => !ctx.session.pixKey)
    .inlineQuery(/[\d.,]+/gi, (ctx) =>
      ctx.answerInlineQuery([], {
        switch_pm_text: "Clique aqui pra se cadastrar",
        switch_pm_parameter: ctx.inlineQuery.query,
        cache_time: 0,
      }));
}
