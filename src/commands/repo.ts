import { Command } from "../domain/Command.ts";
import { REPO_URL } from "../util/strings.ts";

export const repo: Command = {
  name: "repo",
  helpText: "Envia o link do repositório do bot",
  fn: (ctx) =>
    ctx.reply(
      `Para obter meu código fonte, acesse meu <a href="${REPO_URL}">repositório no GitHub</a>.`,
      { parse_mode: "HTML" },
    ),
};
