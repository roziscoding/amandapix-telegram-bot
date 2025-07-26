import { Composer, InlineKeyboard } from "grammy";
import { AppContext } from "../bot.ts";

export const stop = new Composer<AppContext>((ctx: AppContext) => {
  return ctx.reply("Deseja realmente apagar todos os seus dados?", {
    reply_markup: new InlineKeyboard().text("Sim", "stop").text("Não", "cancel"),
  });
});
