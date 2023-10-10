import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";
import { REPO_URL } from "../util/strings.ts";

export const repo = new Composer<AppContext>((ctx: AppContext) =>
  ctx.reply(
    `Para obter meu código fonte, acesse meu <a href="${REPO_URL}">repositório no GitHub</a>.`,
    { parse_mode: "HTML" },
  )
);
