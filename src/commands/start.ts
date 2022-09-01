import { InlineKeyboard } from 'grammy'
import { AppContext, AppSession } from '../bot'
import { evaluateQuery } from '../util/query'

const KNOWN_MESSAGE = (user: AppSession) =>
  `Opa, tudo certo? Eu já tenho seus dados do Pix aqui, olha só:

\`Chave: ${user.pixKey}\`
\`Cidade: ${user.city}\`
\`Nome: ${user.name}\`

Se quiser alterar esses dados, utilize o comando /setinfo.
Pra gerar um código Pix, me chama no modo inline, ou clica no botão aqui em baixo.`.trim()

const KNOWN_MESSAGE_REQUESTED = (amount: string) => `
Para gerar um código de R$ ${amount} conforme solicitado, clique no botão abaixo.
`

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
    return ctx.conversation.enter('setInfo')
  }
}
