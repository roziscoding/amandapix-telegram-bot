import { Command } from '../domain/Command'

const stop: Command = {
  name: 'stop',
  regex: /\/stop/,
  helpText:
    'Apaga todos os dados que eu tenho armazenados sobre você SEM PEDIR CONFIRMAÇÃO.',
  fn: async (ctx) => {
    await ctx.repository.forget(ctx.user.telegramId)
    return null
  }
}

export default stop
