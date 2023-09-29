import { AppContext } from "../bot.ts";
import { safeHtml, stripIndents } from "../deps.ts";

export const getInfo = (ctx: AppContext) => {
  if (!ctx.session.pixKey) {
    return ctx.reply("Ainda não te conheço! Use /start pra se cadastrar.");
  }
  const message = stripIndents(safeHtml)`
      Aqui estão todas as informações que eu tenho sobre você:
      
      <b>Chave PIX</b>: ${ctx.session.pixKey}
      <b>Cidade</b>: ${ctx.session.city}
      <b>Nome</b>: ${ctx.session.name}
    `;

  return ctx.reply(message, { parse_mode: "HTML" });
};
