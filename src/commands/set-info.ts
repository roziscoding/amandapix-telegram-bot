import { Command } from '../domain/Command'

export const setInfo: Command = {
  name: 'setinfo',
  helpText: 'Define suas informações',
  fn: async (ctx) => {
    return ctx.conversation.enter('setInfo')
  }
}
