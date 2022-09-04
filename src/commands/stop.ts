import { Command } from '../domain/Command'

export const stop: Command = {
  name: 'stop',
  helpText: 'Apaga todos os dados que eu tenho armazenados sobre você',
  fn: async (ctx) => {
    return ctx.conversation.enter('stop')
  }
}
