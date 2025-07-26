import { Composer } from "grammy";
import { AppContext } from "../bot.ts";

export const setInfo = new Composer<AppContext>((ctx: AppContext) => {
  return ctx.conversation.enter("setInfo");
});
