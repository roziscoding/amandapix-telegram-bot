import { AppContext } from "../bot.ts";
import { REPO_URL } from "../util/strings.ts";

export const repo = (ctx: AppContext) =>
  ctx.reply(
    `Para obter meu código fonte, acesse meu <a href="${REPO_URL}">repositório no GitHub</a>.`,
    { parse_mode: "HTML" },
  );
