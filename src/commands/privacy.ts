import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";
import { PRIVACY_TEXT } from "../util/strings.ts";

export const privacy = new Composer<AppContext>((ctx: AppContext) => ctx.reply(PRIVACY_TEXT, { parse_mode: "HTML" }));
