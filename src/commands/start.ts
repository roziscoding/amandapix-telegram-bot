import { Command } from '../domain/Command'
import { User } from '../domain/User'
import { evaluateQuery } from '../handleInlineQuery'

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

const start: Command = {
  name: 'start',
  regex: /\/start ?(?<amount>\d+)?/,
  helpText: 'Cria seu cadastro, caso ainda não exista',
  fn: async (ctx) => {
    const amount = ctx.match?.groups?.amount

    if (ctx.user.pixKey && !amount) {
      return ctx.sendMessage(KNOWN_MESSAGE(ctx.user), true, {
        inline_keyboard: [
          [
            {
              text: 'Gerar código Pix',
              switch_inline_query: ''
            }
          ]
        ]
      })
    }

    if (ctx.user.pixKey && amount) {
      const parsedAmount = await evaluateQuery(amount)
      return ctx.sendMessage(KNOWN_MESSAGE_REQUESTED(parsedAmount.toFixed(2)), false, {
        inline_keyboard: [
          [
            {
              text: `Gerar código de R$ ${parsedAmount}`,
              switch_inline_query: amount
            }
          ]
        ]
      })
    }

    await ctx.repository.setSesstion(ctx.user.telegramId, 'setinfo', {
      amount,
      step: 1
    })

    return ctx.sendMessage(
      amount
        ? `Opa, entendi que você quer gerar um código de ${amount} mas, pra isso, primeiro me manda sua chave Pix:`
        : `Opa, bora te cadastrar por aqui pra você poder gerar códigos Pix! Primeiro, me manda sua chave Pix:\n\n(Ao responder, você concorda com o armazenamento desses dados com o único propósito de gerar os códigos pix que você solicitar e de acordo com a [política de privacidade](https://github.com/roziscoding/amandapix-telegram-bot/blob/main/PRIVACY.md))`,
      true,
      undefined,
      { disable_web_page_preview: true }
    )
  }
}

export default start
