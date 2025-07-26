import { createDebug as debug } from "@grammyjs/debug";
import { Composer, InlineKeyboard } from "grammy";
import { AppContext } from "../bot.ts";
import { BRL } from "../util/currency.ts";
import { getPixCodeForUser } from "../util/pix-code.ts";
import { evaluateQuery } from "../util/query.ts";
const log = debug("handlers/registered.ts");

function buildAdditionalData(data: Awaited<ReturnType<typeof evaluateQuery>>) {
  if (!data.hasConversion) return ``;

  const { rates, values, originalQuery } = data;
  const ratesArray = Object.entries(rates);

  return [
    "",
    `<b>Cálculo original:</b> ${originalQuery}`,
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

const composer = new Composer<AppContext>();

composer
  .filter((ctx) => !!ctx.session.pixKey)
  .inlineQuery(/.*/gi, async (ctx) => {
    if (!ctx.match || !Array.isArray(ctx.match) || !ctx.match[0]) {
      return ctx.answerInlineQuery([], {
        cache_time: 0,
      }).catch(() => {});
    }

    log("inlineQuery", ctx.match);

    const [query] = ctx.match;
    const parsedQueryData = await evaluateQuery(query);
    log("parsed query data:", parsedQueryData);
    const { finalValue } = parsedQueryData;
    log("final value:", finalValue);

    if (!finalValue) return ctx.answerInlineQuery([], { cache_time: 0 }).catch(() => {});

    const pixCode = getPixCodeForUser(ctx.session, finalValue);
    log("pix code:", pixCode);
    const qrCodeUrl = ctx.getQrCodeUrl(pixCode);
    log("qr code url:", qrCodeUrl);

    const formattedAmount = BRL(finalValue);
    log("formatted amount:", formattedAmount);

    return ctx.answerInlineQuery([
      {
        id: query,
        type: "article",
        title: `Receber ${formattedAmount}`,
        input_message_content: {
          message_text: [
            `Para me transferir ${formattedAmount}, utilize os botões abaixo.`,
            "",
            `<b>Valor:</b> ${formattedAmount}`,
            `<b>Chave PIX:</b> <code>${ctx.session.pixKey}</code>`,
            ...buildAdditionalData(parsedQueryData),
          ].join("\n"),
          parse_mode: "HTML",
        },
        reply_markup: new InlineKeyboard()
          .copyText("Copiar Pix Copia e Cola", pixCode)
          .row()
          .url("Visualizar QRCode", qrCodeUrl)
          .row()
          .text("Marcar como concluído", `done_${finalValue}`),
      },
      {
        id: `req-${query}`,
        type: "article",
        title: `Enviar ${formattedAmount}`,
        input_message_content: {
          message_text:
            `${ctx.session.name} deseja te enviar ${formattedAmount} via pix! Para gerar um código pix neste valor, clique no botão abaixo.`,
        },
        reply_markup: new InlineKeyboard().switchInlineCurrent(
          `Gerar código pix de ${formattedAmount}`,
          finalValue.toFixed(2),
        ),
      },
    ], { cache_time: 0 })
      .catch(console.error);
  });

export default composer;
