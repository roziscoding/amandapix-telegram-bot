import { stripIndents } from 'common-tags'
import { InlineKeyboard } from 'grammy'
import { AppContext, AppSession } from '../bot'
import { evaluateQuery } from '../util/query'

const KNOWN_MESSAGE = (user: AppSession) => stripIndents`
    Opa, tudo certo? Eu já tenho seus dados do Pix aqui, olha só:

    <code>Chave: ${user.pixKey}</code>
    <code>Cidade: ${user.city}</code>
    <code>Nome: ${user.name}</code>

    Se quiser alterar esses dados, utilize o comando /setinfo.
    Pra gerar um código Pix, me chama no modo inline, ou clica no botão aqui em baixo.
  `

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
      return ctx.reply(KNOWN_MESSAGE(ctx.session), { reply_markup: keyboard, parse_mode: 'HTML' })
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
