import { Composer } from "grammy";
import { AppContext } from "../bot.ts";

const composer = new Composer<AppContext>();

composer.callbackQuery("cancel", async (ctx) => {
  await ctx.editMessageReplyMarkup(undefined);
  await ctx.reply("Ok, deixa pra lá então :)");
});

export default composer;
