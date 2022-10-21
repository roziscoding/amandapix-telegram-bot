import { AppContext } from '../bot'
import { Command } from '../domain/Command'

export const cancel: Command = {
  name: 'cancel',
  helpText: 'Cancela a operação atual',
  fn: async (ctx: AppContext) => {
    delete ctx.session.query
    await ctx.reply('Tudo bem. Deixa pra lá :)', { reply_markup: { remove_keyboard: true } })
    await ctx.conversation.exit()
  }
}