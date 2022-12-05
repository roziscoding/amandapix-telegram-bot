import { Command } from "../domain/Command.ts";
import { PRIVACY_TEXT } from "../util/strings.ts";

export const privacy: Command = {
  name: "privacy",
  helpText: "Envia o link da política de privacidade do bot",
  fn: (ctx) => ctx.reply(PRIVACY_TEXT, { parse_mode: "HTML" }),
};
