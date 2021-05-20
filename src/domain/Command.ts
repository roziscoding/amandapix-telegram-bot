import { Message, Telegram } from 'typegram'
import { UserRepository } from '../repositories/users'
import { Response } from './Response'
import { User } from './User'

type Awaitable<T> = Promise<T> | T

export type Context = {
  user: User
  repository: UserRepository
  message: Message.TextMessage
  match: RegExpMatchArray | null
  command: Command
}

export type Command = {
  name: string
  regex: RegExp
  helpText?: string
  fn: (ctx: Context) => Awaitable<Response<keyof Telegram>>
}
