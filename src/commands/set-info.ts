import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";

export const setInfo = new Composer<AppContext>((ctx: AppContext) => {
  return ctx.conversation.enter("setInfo");
});
