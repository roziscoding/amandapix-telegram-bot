import { AppContext } from '../bot'

export const cancel = {
  name: 'cancel',
  helpText: 'Cancela a operação atual',
  fn: (ctx: AppContext) => {
    if (ctx.session.wizard?.id === 'setInfo') {
      ctx.session.city = ''
      ctx.session.name = ''
      ctx.session.pixKey = ''
    }
    ctx.wizard.exit()
    delete ctx.session.query
    return ctx.reply('Ok, deixa pra lá')
  }
}
