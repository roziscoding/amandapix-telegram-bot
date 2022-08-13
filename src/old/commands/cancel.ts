import { REMOVE_KEYBOARD } from '../../util/telegram/sendMessage'
import { Command } from '../domain/Command'

const cancel: Command = {
  name: 'cancel',
  regex: /\/cancel/,
  helpText: 'Cancela qualquer operação que estiver sendo realizada',
  fn: async (ctx) => {
    if (!ctx.user.session?.command) {
      return ctx.sendMessage('Eu nem tava fazendo nada pô...', false, REMOVE_KEYBOARD)
    }

    await ctx.repository.clearSession(ctx.user.telegramId)

    return ctx.sendMessage('Ok, deixa pra lá então', false, REMOVE_KEYBOARD)
  }
}

export default cancel
