import { Command } from '../domain/Command'
import { REMOVE_KEYBOARD, sendMessage } from '../util/telegram/sendMessage'

const cancel: Command = {
  name: 'cancel',
  regex: /\/cancel/,
  helpText: 'Cancela qualquer operação que estiver sendo realizada',
  fn: async (ctx) => {
    if (!ctx.user.session?.command) {
      return sendMessage(ctx.user.telegramId, 'Eu nem tava fazendo nada pô...')
    }

    await ctx.repository.clearSession(ctx.user.telegramId)

    return sendMessage(
      ctx.user.telegramId,
      'Ok, deixa pra lá então',
      false,
      REMOVE_KEYBOARD
    )
  }
}

export default cancel
