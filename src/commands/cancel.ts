import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";

export const cancel = new Composer<AppContext>(async (ctx) => {
  delete ctx.session.query;
  await ctx.reply("Tudo bem. Deixa pra lá :)", {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.conversation.exit();
});
