import { AppContext } from '../bot'

export type Command = {
  name: string
  helpText?: string
  fn: (ctx: AppContext) => any
}
