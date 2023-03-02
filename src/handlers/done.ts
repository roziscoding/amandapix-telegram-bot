import { Bot } from "https://deno.land/x/grammy@v1.13.1/mod.ts";
import { AppContext } from "../bot.ts";
import { BRL } from "../util/currency.ts";

export function install(bot: Bot<AppContext>) {
  bot.callbackQuery(/done_(.*)/, async (ctx) => {
    const amount = ctx.match?.[1];
    const text = amount
      ? `Pix de ${BRL(amount)} marcado como concluído por ${ctx.from.first_name}`
      : `Pix marcado como concluído por ${ctx.from.first_name}`;

    await ctx.editMessageText(text);
  });
}
