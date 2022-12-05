import * as commands from "../commands.ts";
import { Command } from "../domain/Command.ts";

const help: Command = {
  name: "help",
  fn: (ctx) => {
    const message = [
      "Aqui está a lista dos comandos mais importantes:\n",
      ...Object.values(commands)
        .filter((command) => !!command.helpText)
        .map((command) => `/${command.name}: ${command.helpText}`),
    ].join("\n");

    return ctx.reply(message);
  },
};

export default help;
