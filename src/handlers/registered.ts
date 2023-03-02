import { BRL } from "../util/currency.ts";
import { Bot, InlineKeyboard } from "grammy";
import { AppContext } from "../bot.ts";
import { getPixCodeForUser } from "../util/pix-code.ts";
import { evaluateQuery } from "../util/query.ts";

function buildAdditionalData(data: Awaited<ReturnType<typeof evaluateQuery>>) {
  if (!data.hasConversion) return ``;

  const { rates, values, originalQuery } = data;
  const ratesArray = Object.entries(rates);

  return [
    "",
    `<b>Cálculo original:</b> ${originalQuery}`
    "",
    "<b>Valores de Câmbio:</b>",
    ...ratesArray.map(([currency, rate]) => `<b>${currency}:</b> ${BRL(rate)}`),
    "",
    "<b>Valores convertidos:</b>",
    ...values.filter(({ currency }) => currency !== "BRL").map(({ currency, value, converted }) =>
      `<b>${value} ${currency}</b> = ${BRL(converted)}`
    ),
  ];
}

export function install(bot: Bot<AppContext>) {
  bot
    .filter((ctx) => !!ctx.session.pixKey)
    .inlineQuery(/.*/gi, async (ctx) => {
      if (!ctx.match || !Array.isArray(ctx.match) || !ctx.match[0]) {
        return ctx.answerInlineQuery([], {
          cache_time: 0,
        });
      }

      const [query] = ctx.match;

      const parsedQueryData = await evaluateQuery(query);
      const { finalValue } = parsedQueryData;

      if (!finalValue) return ctx.answerInlineQuery([], { cache_time: 0 });

      const pixCode = getPixCodeForUser(ctx.session, finalValue);
      const qrCodeUrl = ctx.getQrCodeUrl(pixCode);

      const formattedAmount = BRL(finalValue);

      return ctx.answerInlineQuery([
        {
          id: query,
          type: "article",
          title: `Gerar código pix de ${formattedAmount}`,
          input_message_content: {
            message_text: [
              `Para me transferir ${formattedAmount}, escaneie o <a href="${qrCodeUrl}">QRCode</a> ou utilize o código abaixo (clique no código para copiar).`,
              "",
              `<b>Valor:</b> ${formattedAmount}`,
              `<b>Chave PIX:</b> <code>${ctx.session.pixKey}</code>`,
              ...buildAdditionalData(parsedQueryData),
              "",
              `<b>Pix Copia e Cola:</b>`,
              `<code>${pixCode}</code>`,
            ].join("\n"),
            parse_mode: "HTML",
          },
          reply_markup: new InlineKeyboard().text(
            "Marcar como concluído",
            `done_${finalValue}`,
          ),
        },
        {
          id: `req-${query}`,
          type: "article",
          title: `Solicitar código pix de ${formattedAmount}`,
          input_message_content: {
            message_text:
              `${ctx.session.name} deseja te enviar ${formattedAmount} via pix! Para gerar um código pix neste valor, clique no botão abaixo.`,
          },
          reply_markup: new InlineKeyboard().switchInlineCurrent(
            `Gerar código pix de ${formattedAmount}`,
            finalValue.toFixed(2),
          ),
        },
      ], { cache_time: 0 });
    });
}
