import { AppContext } from "../bot.ts";
import { PRIVACY_TEXT } from "../util/strings.ts";

export const privacy = (ctx: AppContext) => ctx.reply(PRIVACY_TEXT, { parse_mode: "HTML" });
