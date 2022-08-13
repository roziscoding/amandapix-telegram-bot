import { Message, Params, Telegram } from 'typegram'
import { Markup, sendMessage } from '../../util/telegram/sendMessage'
import { Awaitable } from '../../util/types/Awaitable'
import { UserRepository } from '../repositories/users'
import { Response } from './Response'
import { User } from './User'

export type Context = {
  user: User
  repository: UserRepository
  message: Message.TextMessage
  match: RegExpMatchArray | null
  command: Command
  sendMessage: (
    text: string,
    markdown?: boolean,
    markup?: Markup,
    extra?: Partial<Params<'sendMessage', any>[0]>
  ) => ReturnType<typeof sendMessage>
}

export type Command = {
  name: string
  regex: RegExp
  helpText?: string
  fn: (ctx: Context) => Awaitable<Response<keyof Telegram> | null>
}
