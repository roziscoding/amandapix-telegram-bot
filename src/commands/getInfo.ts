import { format } from 'util'
import { Command } from '../domain/Command'
import { sendMessage } from '../util/telegram/sendMessage'

const getInfo: Command = {
  name: 'getinfo',
  regex: /\/getinfo/,
  helpText: 'Exibe todas as informações que eu tenho sobre você',
  fn: async (ctx) => {
    const message = format(
      'Aqui estão todas as informações que eu tenho sobre você:\n\n```%s```',
      JSON.stringify(ctx.user, null, 4)
    )

    return sendMessage(ctx.user.telegramId, message, true)
  }
}

export default getInfo
