import { AppContext } from "../bot.ts";

export const stop = (ctx: AppContext) => {
  return ctx.conversation.enter("stop");
};
