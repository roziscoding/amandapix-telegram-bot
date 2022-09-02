import { stripIndents } from 'common-tags'
import { Command } from '../domain/Command'

export const stop: Command = {
  name: 'stop',
  helpText: 'Apaga todos os dados que eu tenho armazenados sobre você',
  fn: async (ctx) => {
    // return ctx.conversation.enter('stop')

    if (ctx.hasText(/ certeza/i)) {
      ctx.session = undefined

      return ctx.reply('OK. Apaguei tudo que eu sei sobre você')
    }

    return ctx.reply(
      stripIndents`
        Tem certeza que deseja apagar tudo que eu sei sobre você? Isso não pode ser desfeito!
        Para confirmar, me envie <code>/stop certeza</code>
      `,
      { parse_mode: 'HTML' }
    )
  }
}
