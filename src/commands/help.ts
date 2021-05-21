import { Command } from '../domain/Command'
import { sendMessage } from '../util/telegram/sendMessage'
import commands, { specialCommands } from './'

const help: Command = {
  name: 'help',
  regex: /\/help/,
  fn: async (ctx) => {
    const message = [
      'Aqui está a lista dos comandos mais importantes:\n',
      ...Object.values(commands)
        .concat(Object.values(specialCommands))
        .filter((command) => !!command.helpText)
        .map((command) => `/${command.name}: ${command.helpText}`)
    ].join('\n')

    return sendMessage(ctx.user.telegramId, message)
  }
}

export default help
