import { AppContext } from '../bot'

export const setInfo = {
  name: 'setinfo',
  helpText: 'Define suas informações',
  fn: async (ctx: AppContext) => {
    return ctx.conversation.enter('setInfo')
  }
}
