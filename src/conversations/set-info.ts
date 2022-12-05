import {
  Conversation,
  createConversation,
} from "https://deno.land/x/grammy_conversations@v1.1.0/mod.ts";
import {
  oneLine,
  safeHtml,
  stripIndents,
} from "https://esm.sh/common-tags@1.8.2";
import { InlineKeyboard } from "https://deno.land/x/grammy@v1.12.0/mod.ts";
import { AppContext } from "../bot.ts";
import { evaluateQuery } from "../util/query.ts";

const PRIVACY_URL =
  "https://github.com/roziscoding/amandapix-telegram-bot/blob/main/PRIVACY.md";

const confirm = () =>
  new InlineKeyboard().text("Sim", "sim").text("Não", "não");
const cancellable = (fn: (ctx: AppContext) => unknown) => (ctx: AppContext) =>
  ctx.hasCommand("cancel") ?? fn(ctx);

const setInfo = async (
  conversation: Conversation<AppContext>,
  ctx: AppContext,
) => {
  await ctx.reply(
    oneLine`
      Antes de começarmos, preciso que você leia minha <a href="${PRIVACY_URL}">política de privacidade</a>.
      Você concorda com a política de privacidade?.
    `,
    {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: confirm(),
    },
  );

  const privacyPolicy = await conversation
    .waitFor(
      "callback_query:data",
      (ctx) => ctx.reply("Não entendi... Por favor, clique em um dos botões"),
    )
    .then(async (ctx) => {
      await ctx.editMessageReplyMarkup({});
      return ctx;
    })
    .then((ctx) => ctx.callbackQuery.data);

  if (privacyPolicy === "não") {
    await ctx.reply("Tudo bem. Deixa pra lá então.", {
      reply_markup: { remove_keyboard: true },
    });
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

  await ctx.reply("Boa! Agora sim, podemos começar!", {
    reply_markup: { remove_keyboard: true },
  });

  let confirmmed = false;

  while (!confirmmed) {
    await ctx.reply("Primeiro, me envia sua chave pix.");
    const pixKey = await conversation.form.text(
      cancellable((ctx) =>
        ctx.reply("Me manda sua chave pix como texto, por favor!")
      ),
    );

    await ctx.reply("Show. Agora me manda sua cidade, por favor");
    const city = await conversation.form.text(
      cancellable((ctx) =>
        ctx.reply(
          "Pra continuarmos, preciso que me mande sua cidade como texto",
        )
      ),
    );

    await ctx.reply("Boa. Por último, me diz seu nome");
    const name = await conversation.form.text(
      cancellable((ctx) =>
        ctx.reply(
          "Ainda não sei seu nome... Pode me mandar como texto, por favor?",
        )
      ),
    );

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

    const [confirmation, newContext] = await conversation
      .waitFor(
        "callback_query:data",
        cancellable((ctx) =>
          ctx.reply(
            "Não entendi... Por favor, usa os botões pra me responder :)",
          )
        ),
      )
      .then(async (ctx) => {
        await ctx.editMessageReplyMarkup({});
        return ctx;
      })
      .then((ctx) => [ctx.callbackQuery.data, ctx] as const);

    if (confirmation === "cancel") {
      return ctx.reply(
        "OK. Deixa pra lá então. Espero poder ajudar numa próxima :)",
        {
          reply_markup: { remove_keyboard: true },
        },
      );
    }

    if (confirmation.match("não")) {
      await ctx.reply("Putz. Bora do começo?", {
        reply_markup: { remove_keyboard: true },
      });
      continue;
    }

    confirmmed = true;

    newContext.session.pixKey = pixKey;
    newContext.session.city = city;
    newContext.session.name = name;
  }

  await ctx.reply("Só mais um minuto...", {
    reply_markup: { remove_keyboard: true },
  });
  await conversation.sleep(1000);

  if (ctx.session.query) {
    const amount = await evaluateQuery(ctx.session.query) ?? 0;
    const keyboard = new InlineKeyboard().switchInline(
      `Gerar código Pix de R$ ${amount.toString()}`,
      ctx.session.query,
    );
    return ctx.reply(
      `Pronto! Agora tá tudo certo pra gerar o código Pix de R$ ${amount}. É só clicar no botão:`,
      {
        reply_markup: keyboard,
      },
    );
  }

  const keyboard = new InlineKeyboard().switchInline(`Gerar código Pix`);
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

export default createConversation<AppContext>(setInfo);
