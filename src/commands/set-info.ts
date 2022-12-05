import { Command } from "../domain/Command.ts";

export const setInfo: Command = {
  name: "setinfo",
  helpText: "Define suas informações",
  fn: (ctx) => {
    return ctx.conversation.enter("setInfo");
  },
};
