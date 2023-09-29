import { AppContext } from "../bot.ts";

export const cancel = async (ctx: AppContext) => {
  delete ctx.session.query;
  await ctx.reply("Tudo bem. Deixa pra lá :)", {
    reply_markup: { remove_keyboard: true },
  });
  await ctx.conversation.exit();
};
