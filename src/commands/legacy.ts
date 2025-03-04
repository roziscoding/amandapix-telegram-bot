import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";

export const legacy = new Composer<AppContext>((ctx) => {
  if (ctx.session.legacyLayout) {
    ctx.session.legacyLayout = false;
    return ctx.reply("Layout antigo desabilitado");
  }

  ctx.session.legacyLayout = true;
  return ctx.reply("Layout antigo habilitado");
});
