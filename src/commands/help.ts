import * as commands from '.'
import { Command } from '../domain/Command'

const help: Command = {
  name: 'help',
  fn: async (ctx) => {
    const message = [
      'Aqui está a lista dos comandos mais importantes:\n',
      ...Object.values(commands)
        .filter((command) => !!command.helpText)
        .map((command) => `/${command.name}: ${command.helpText}`)
    ].join('\n')

    return ctx.reply(message)
  }
}

export default help
