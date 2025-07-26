import { Composer } from "grammy";
import { AppContext } from "../bot.ts";
import { BRL } from "../util/currency.ts";

const composer = new Composer<AppContext>();

composer.callbackQuery(/done_(.*)/, async (ctx) => {
  const amount = ctx.match?.[1];
  const text = amount
    ? `Pix de ${BRL(amount)} marcado como concluído por ${ctx.from.first_name}`
    : `Pix marcado como concluído por ${ctx.from.first_name}`;

  await ctx.editMessageText(text);
});

export default composer;
