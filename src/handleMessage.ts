import { Message } from 'typegram'
import commands, { specialCommands } from './commands'
import { Command, Context } from './domain/Command'
import { User } from './domain/User'
import { UserRepository } from './repositories/users'

// eslint-disable-next-line camelcase
export const I_DONT_GET_IT: Command = {
  name: 'notFound',
  regex: /.*/,
  fn: (ctx) => ({
    method: 'sendMessage',
    text: 'Uh... Não entendi. Pra ver a lista de comandos, me envie /help',
    chat_id: ctx.user.telegramId
  })
}

const getContext = (
  user: User,
  repository: UserRepository,
  message: Message.TextMessage
): Context => {
  const specialCommand = Object.values(specialCommands).find((command) =>
    command.regex.test(message.text)
  )

  const sessionCommand = user.session?.command
    ? commands[user.session.command as keyof typeof commands]
    : null

  const command =
    specialCommand ||
    sessionCommand ||
    Object.values(commands)
      .concat(I_DONT_GET_IT)
      .find((command) => command.regex.test(message.text))!

  const match = message.text.match(command.regex)

  return {
    user,
    repository,
    message,
    match,
    command
  }
}

export function handleMessage(
  user: User,
  repository: UserRepository,
  message: Message.TextMessage
) {
  const context = getContext(user, repository, message)

  return context.command.fn(context)
}
