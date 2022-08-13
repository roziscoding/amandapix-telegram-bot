import { InlineKeyboard } from 'grammy'
import { AppContext } from '../bot'
import { User } from '../domain/User'
import { evaluateQuery } from '../old/handleInlineQuery'

const KNOWN_MESSAGE = (user: User) =>
  `Opa, tudo certo? Eu já tenho seus dados do Pix aqui, olha só:

\`Chave: ${user.pixKey}\`
\`Cidade: ${user.city}\`
\`Nome: ${user.name}\`

Se quiser alterar esses dados, utilize o comando /setinfo.
Pra gerar um código Pix, me chama no modo inline, ou clica no botão aqui em baixo.`.trim()

const KNOWN_MESSAGE_REQUESTED = (amount: string) => `
Para gerar um código de R$ ${amount} conforme solicitado, clique no botão abaixo.
`

const PRIVACY = `\n\n\\(Ao responder, você concorda com o armazenamento desses dados com o único propósito de gerar os códigos pix que você solicitar e de acordo com a [política de privacidade](https://github.com/roziscoding/amandapix-telegram-bot/blob/main/PRIVACY.md)\\)`

export const start = {
  name: 'start',
  helpText: 'Cria seu cadastro, caso ainda não exista',
  fn: async (ctx: AppContext) => {
    const query = ctx.match as string

    const { pixKey, name, city } = ctx.session
    const hasUserData = pixKey && name && city

    if (hasUserData && !query) {
      const keyboard = new InlineKeyboard().switchInlineCurrent('Gerar código Pix', '')
      return ctx.reply(KNOWN_MESSAGE(ctx.session), { reply_markup: keyboard, parse_mode: 'MarkdownV2' })
    }

    if (hasUserData && query) {
      const amount = await evaluateQuery(query)
      const keyboard = new InlineKeyboard().switchInlineCurrent(`Gerar código de R$ ${amount}`, query)
      return ctx.reply(KNOWN_MESSAGE_REQUESTED(amount.toFixed(2)), { reply_markup: keyboard })
    }

    if (query) ctx.session.query = query
    ctx.wizard.enter('setInfo', { step: 1 })

    const text = query
      ? `Opa, entendi que você quer gerar um código de ${query} mas, pra isso, primeiro me manda sua chave Pix:${PRIVACY}`
      : `Opa, bora te cadastrar por aqui pra você poder gerar códigos Pix\\! Primeiro, me manda sua chave Pix:${PRIVACY}`

    return ctx.reply(text, { disable_web_page_preview: true, parse_mode: 'MarkdownV2' })
  }
}
