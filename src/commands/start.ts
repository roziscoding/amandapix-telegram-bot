import { Command } from '../domain/Command'
import { User } from '../domain/User'
import { sendMessage } from '../util/telegram/sendMessage'

const KNOWN_MESSAGE = (user: User) =>
  `Opa, tudo certo? Eu já tenho seus dados do Pix aqui, olha só:

\`Chave: ${user.pixKey}\`
\`Cidade: ${user.city}\`
\`Nome: ${user.name}\`

Se quiser alterar esses dados, utilize o comando /setinfo.
Pra gerar um código Pix, me chama no modo inline, ou clica no botão aqui em baixo.`.trim()

const start: Command = {
  name: 'start',
  regex: /\/start ?(?<amount>\d+)?/,
  helpText: 'Cria seu cadastro, caso ainda não exista',
  fn: async (ctx) => {
    const { user } = ctx

    if (user.pixKey) {
      return sendMessage(user.telegramId, KNOWN_MESSAGE(user), true, {
        inline_keyboard: [
          [
            {
              text: 'Gerar código Pix',
              switch_inline_query: ctx.match?.groups?.amount || ''
            }
          ]
        ]
      })
    }

    if (ctx.match?.groups?.amount) {
      const amount = ctx.match.groups.amount
      await ctx.repository.setSesstion(user.telegramId, 'setInfo', {
        amount,
        step: 1
      })

      return sendMessage(
        user.telegramId,
        `Opa, entendi que você quer gerar um código de ${amount} mas, pra isso, primeiro me manda sua chave Pix:`
      )
    }

    return sendMessage(
      user.telegramId,
      `\`\`\`\n${JSON.stringify({ text: ctx.message.text }, null, 4)}\`\`\``,
      true
    )
  }
}

export default start
