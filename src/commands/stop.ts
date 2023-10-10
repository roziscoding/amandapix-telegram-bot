import { AppContext } from "../bot.ts";
import { Composer, InlineKeyboard } from "../deps.ts";

export const stop = new Composer<AppContext>((ctx: AppContext) => {
  return ctx.reply("Deseja realmente apagar todos os seus dados?", {
    reply_markup: new InlineKeyboard().text("Sim", "stop").text("Não", "cancel"),
  });
});
