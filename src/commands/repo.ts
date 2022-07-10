import { format } from 'util'
import { Command } from '../domain/Command'
import { REPO_URL } from '../util/strings'

const repo: Command = {
  name: 'repo',
  regex: /\/repo/,
  helpText: 'Envia o link do repositório do bot',
  fn: async (ctx) => {
    const message = format(
      'Para obter meu código fonte, acesse meu [repositório no GitHub](%s)',
      REPO_URL
    )

    return ctx.sendMessage(message, true)
  }
}

export default repo
