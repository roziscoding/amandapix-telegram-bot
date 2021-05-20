import { Message, Telegram } from 'typegram'
import { UserRepository } from '../repositories/users'
import { Response } from './Response'
import { User } from './User'

type Awaitable<T> = Promise<T> | T

export type Command = {
  name: string
  regex: RegExp
  helpText?: string
  fn: (
    match: RegExpMatchArray | null,
    message: Message,
    user: User,
    repository: UserRepository
  ) => Awaitable<Response<keyof Telegram>>
}
