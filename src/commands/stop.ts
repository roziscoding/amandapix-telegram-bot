import { Command } from "../domain/Command.ts";

export const stop: Command = {
  name: "stop",
  helpText: "Apaga todos os dados que eu tenho armazenados sobre você",
  fn: (ctx) => {
    return ctx.conversation.enter("stop");
  },
};
