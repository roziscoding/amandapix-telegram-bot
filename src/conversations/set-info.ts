import { Conversation, createConversation } from "@grammyjs/conversations";
import { oneLine, safeHtml, stripIndents } from "@hexagon/proper-tags";
import { Context, InlineKeyboard } from "grammy";
import { AppContext } from "../bot.ts";
import { BRL } from "../util/currency.ts";
import { evaluateQuery } from "../util/query.ts";

const PRIVACY_URL = "https://github.com/roziscoding/amandapix-telegram-bot/blob/main/PRIVACY.md";

const confirm = () => new InlineKeyboard().text("Sim", "sim").text("Não", "não");

const setInfo = async (
  conversation: Conversation<AppContext, Context>,
  ctx: Context,
) => {
  const session = await conversation.external((ctx) => ctx.session);
  const isOnboarded = session.onboarded ?? true;

  if (!isOnboarded) {
    await ctx.reply(
      oneLine`
      Antes de começarmos, preciso que você leia minha <a href="${PRIVACY_URL}">política de privacidade</a>.
      Você concorda com a política de privacidade?.
    `,
      {
        parse_mode: "HTML",
        reply_markup: confirm(),
        link_preview_options: {
          is_disabled: true,
        },
      },
    );

    const privacyPolicy = await conversation
      .waitFor("callback_query:data")
      .then(async (ctx) => {
        await ctx.editMessageReplyMarkup({});
        return ctx;
      })
      .then((ctx) => ctx.callbackQuery.data);

    if (privacyPolicy === "não") {
      await ctx.reply("Tudo bem. Deixa pra lá então.");
      return ctx.reply(
        "Se quiser sugerir mudanças na minha política de privacidade, você pode abrir uma issue no meu repositório.",
        {
          reply_markup: new InlineKeyboard().url(
            "Abrir issue",
            "https://github.com/roziscoding/amandapix-telegram-bot/issues/new",
          ),
        },
      );
    }

    await ctx.reply("Boa! Agora sim, podemos começar!");
  }

  let confirmmed = false;

  while (!confirmmed) {
    await ctx.reply("Primeiro, me envia sua chave pix. Se for telefone, preciso do número com DDD.");
    const pixKey = await conversation
      .waitFor("message:text")
      .then((ctx) => ctx.message.text)
      .then((answer) => {
        if (answer.length === 11) return answer;
        return answer.replace(/\(|\)|\s/ig, "");
      });

    await ctx.reply("Show. Agora me manda sua cidade, por favor");
    const city = await conversation
      .waitFor("message:text")
      .then((ctx) => ctx.message.text);

    await ctx.reply("Boa. Por último, me diz seu nome");
    const name = await conversation
      .waitFor("message:text")
      .then((ctx) => ctx.message.text);

    await ctx.reply(
      stripIndents(safeHtml)`
      Boa! Então me confirma se tá tudo certo. Esses são os dados que eu anotei:

      <b>Chave PIX</b>: ${pixKey}
      <b>Cidade</b>: ${city}
      <b>Nome</b>: ${name}

      Tá correto?
    `,
      {
        parse_mode: "HTML",
        reply_markup: confirm().text("Cancelar", "cancel"),
      },
    );

    const confirmation = await conversation
      .waitFor("callback_query:data")
      .then(async (ctx) => {
        await ctx.editMessageReplyMarkup({});
        return ctx;
      })
      .then((ctx) => ctx.callbackQuery.data);

    if (confirmation === "cancel") {
      return ctx.reply("OK. Deixa pra lá então. Espero poder ajudar numa próxima :)");
    }

    if (confirmation.match("não")) {
      await ctx.reply("Putz. Bora do começo?");
      continue;
    }

    confirmmed = true;

    session.pixKey = pixKey;
    session.city = city;
    session.name = name;
    session.onboarded = true;
  }

  if (session.query) {
    const amount = await evaluateQuery(session.query).then(({ finalValue }) => finalValue ?? 0);
    const keyboard = new InlineKeyboard().switchInline(
      `Gerar código Pix de ${BRL(amount)}`,
      session.query,
    );
    return ctx.reply(
      `Pronto! Agora tá tudo certo pra gerar o código Pix de ${BRL(amount)}. É só clicar no botão:`,
      {
        reply_markup: keyboard,
      },
    );
  }

  const keyboard = new InlineKeyboard().switchInline(`Gerar código Pix`);

  await conversation.external((ctx) => ctx.session = session);

  return ctx.reply(
    stripIndents`
      Pronto! Agora tá tudo certo pra gerar códigos Pix. Pra isso, é só clicar no botão aqui em baixo.
      
      Você também pode digitar, em qualquer chat, <code>@amandapixbot 10</code>, trocando "10" pelo valor desejado, ou por uma operação matemática.
    `,
    {
      parse_mode: "HTML",
      reply_markup: keyboard,
    },
  );
};

export default createConversation<AppContext, Context>(setInfo);
