import { Conversation, createConversation } from '@grammyjs/conversations'
import { oneLine, safeHtml, stripIndents } from 'common-tags'
import { InlineKeyboard, Keyboard } from 'grammy'
import { evaluateQuery } from '../../old/handleInlineQuery'
import { AppContext } from '../bot'

const PRIVACY_URL = 'https://github.com/roziscoding/amandapix-telegram-bot/blob/main/PRIVACY.md'

const confirm = new Keyboard().text('Sim').text('Não').oneTime()
const cancellable = (fn: (ctx: AppContext) => any) => (ctx: AppContext) => ctx.hasCommand('cancel') ?? fn(ctx)

const setInfo = async (conversation: Conversation<AppContext>, ctx: AppContext) => {
  await ctx.reply(
    oneLine`
      Antes de começarmos, preciso que você leia minha [política de privacidade](${PRIVACY_URL})\\.
      Você concorda com a política de privacidade? Você pode usar /cancel a qualquer momento pra encerrar a conversa\\.
    `,
    { parse_mode: 'MarkdownV2', disable_web_page_preview: true, reply_markup: confirm }
  )

  const privacyPolicy = await conversation.form.select(
    ['Sim', 'Não'],
    cancellable((ctx) => ctx.reply('Usa um dos botões pra me responder, por favor.'))
  )

  if (privacyPolicy === 'Não') {
    await ctx.reply('Tudo bem. Deixa pra lá então.', { reply_markup: { remove_keyboard: true } })
    return ctx.reply(
      'Se quiser sugerir mudanças na minha política de privacidade, você pode abrir uma issue no meu repositório.',
      {
        reply_markup: new InlineKeyboard().url(
          'Abrir issue',
          'https://github.com/roziscoding/amandapix-telegram-bot/issues/new'
        )
      }
    )
  }

  await ctx.reply('Boa! Agora sim, podemos começar!', { reply_markup: { remove_keyboard: true } })

  await ctx.reply('Primeiro, me envia sua chave pix.')
  const pixKey = await conversation.form.text(
    cancellable((ctx) => ctx.reply('Me manda sua chave pix como texto, por favor!'))
  )

  await ctx.reply('Show. Agora me manda sua cidade, por favor')
  const city = await conversation.form.text(
    cancellable((ctx) => ctx.reply('Pra continuarmos, preciso que me mande sua cidade como texto'))
  )

  await ctx.reply('Boa. Por último, me diz seu nome')
  const name = await conversation.form.text(
    cancellable((ctx) => ctx.reply('Ainda não sei seu nome... Pode me mandar como texto, por favor?'))
  )

  await ctx.reply(
    stripIndents(safeHtml)`
      Boa! Então me confirma se tá tudo certo. Esses são os dados que eu anotei:

      <b>Chave PIX</b>: ${pixKey}
      <b>Cidade</b>: ${city}
      <b>Nome</b>: ${name}

      Tá correto?
    `,
    { parse_mode: 'HTML', reply_markup: confirm.text('Cancelar Cadastro') }
  )

  const confirmation = await conversation.form.select(
    ['Sim', 'Não', 'Cancelar Cadastro'],
    cancellable((ctx) => ctx.reply('Não entendi... Por favor, usa os botões pra me responder :)'))
  )

  if (confirmation === 'Cancelar Cadastro') {
    return ctx.reply('OK. Deixa pra lá então. Espero poder ajudar numa próxima :)', {
      reply_markup: { remove_keyboard: true }
    })
  }

  if (confirmation === 'Não') {
    await ctx.reply('Putz. Bora do começo então', { reply_markup: { remove_keyboard: true } })
    return ctx.conversation.reenter('setInfo')
  }

  // ctx.session.pixKey = pixKey
  // ctx.session.city = city
  // ctx.session.name = name

  await ctx.reply('Só mais um minuto...', { reply_markup: { remove_keyboard: true } })
  await conversation.sleep(1000)

  if (ctx.session.query) {
    const amount = await evaluateQuery(ctx.session.query)
    const keyboard = new InlineKeyboard().switchInline(`Gerar código Pix de R$ ${amount.toString()}`, ctx.session.query)
    return ctx.reply(`Pronto! Agora tá tudo certo pra gerar o código Pix de ${amount} reais. É só clicar no botão:`, {
      reply_markup: keyboard
    })
  }

  const keyboard = new InlineKeyboard().switchInline(`Gerar código Pix`)
  return ctx.reply(
    stripIndents`
      Pronto! Agora tá tudo certo pra gerar códigos Pix. Pra isso, é só clicar no botão aqui em baixo.
      
      Você também pode digitar, em qualquer chat, <code>@amandapixbot 10</code>, trocando "10" pelo valor desejado, ou por uma operação matemática.
    `,
    {
      parse_mode: 'HTML',
      reply_markup: keyboard
    }
  )
}

export default createConversation<AppContext>(setInfo)
