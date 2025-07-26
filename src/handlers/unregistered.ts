import { Composer } from "grammy";
import { AppContext } from "../bot.ts";

const composer = new Composer<AppContext>();

composer
  .filter((ctx) => !ctx.session.pixKey)
  .inlineQuery(/[\d.,]+/gi, (ctx) =>
    ctx.answerInlineQuery([], {
      button: { text: "Clique aqui pra se cadastrar", start_parameter: ctx.inlineQuery.query },
      cache_time: 0,
    }).catch(() => {}));

export default composer;
