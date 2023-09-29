import { AppContext } from "../bot.ts";

export const setInfo = (ctx: AppContext) => {
  return ctx.conversation.enter("setInfo");
};
