import { safeHtml, stripIndents } from 'common-tags'
import { format } from 'util'
import { Command } from '../domain/Command'

export const getInfo: Command = {
  name: 'getinfo',
  helpText: 'Exibe todas as informações que eu tenho sobre você',
  fn: async (ctx) => {
    const message = format(
      'Aqui estão todas as informações que eu tenho sobre você:\n\n```\n%s```',
      stripIndents(safeHtml)`
        <b>Chave PIX</b>: ${ctx.session.pixKey}
        <b>Cidade</b>: ${ctx.session.city}
        <b>Nome</b>: ${ctx.session.name}
      `
    )

    return ctx.reply(message, { parse_mode: 'HTML' })
  }
}
