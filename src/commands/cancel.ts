import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";

export const cancel = new Composer<AppContext>(async (ctx) => {
  delete ctx.session.query;

  const isOnboarded = ctx.session.onboarded ?? true;
  if (!isOnboarded) {
    ctx.session = {
      pixKey: "",
      city: "",
      name: "",
      onboarded: false,
      conversation: undefined
    };
  }

  await ctx.conversation.exit().catch(() => { });

  await ctx.reply("Tudo bem. Deixa pra lá :)", {
    reply_markup: { remove_keyboard: true },
  });
});
