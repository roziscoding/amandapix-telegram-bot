import { Composer } from "grammy";
import { AppContext } from "../bot.ts";

export const cancel = new Composer<AppContext>(async (ctx) => {
  delete ctx.session.query;

  const isOnboarded = ctx.session.onboarded ?? true;
  if (!isOnboarded) {
    ctx.session = {
      pixKey: "",
      city: "",
      name: "",
      onboarded: false,
    };
  }

  await ctx.conversation.exitAll().catch(() => {});

  await ctx.reply("Tudo bem. Deixa pra lá :)", {
    reply_markup: { remove_keyboard: true },
  });
});
