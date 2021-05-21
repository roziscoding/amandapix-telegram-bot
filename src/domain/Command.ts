import { Message, Telegram } from 'typegram'
import { UserRepository } from '../repositories/users'
import { Markup, sendMessage } from '../util/telegram/sendMessage'
import { Awaitable } from '../util/types/Awaitable'
import { Response } from './Response'
import { User } from './User'

export type Context = {
  user: User
  repository: UserRepository
  message: Message.TextMessage
  match: RegExpMatchArray | null
  command: Command
  sendMessage: (text: string, markdown?: boolean, markup?: Markup) => ReturnType<typeof sendMessage>
}

export type Command = {
  name: string
  regex: RegExp
  helpText?: string
  fn: (ctx: Context) => Awaitable<Response<keyof Telegram> | null>
}
