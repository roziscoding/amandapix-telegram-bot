import { Conversation, createConversation } from '@grammyjs/conversations'
import { InlineKeyboard } from 'grammy'
import { AppContext } from '../bot'

const stop = async (converstion: Conversation<AppContext>, ctx: AppContext) => {
  await ctx.reply('Deseja realmente apagar todos os seus dados?', {
    reply_markup: new InlineKeyboard().text('Sim', 'y').text('Não', 'n')
  })

  const [confirmation, newContext] = await converstion
    .waitFor('callback_query:data')
    .then(async (ctx) => {
      await ctx.editMessageReplyMarkup({})
      return ctx
    })
    .then((ctx) => {
      return [ctx.callbackQuery.data === 'y', ctx] as const
    })

  if (!confirmation) {
    return ctx.reply('Beleza, não vou apagar nada então.')
  }

  newContext.session.name = ''
  newContext.session.pixKey = ''
  newContext.session.city = ''
  delete newContext.session.query

  return ctx.reply('Pronto. Excluí todos os dados que eu tinha sobre você')
}

export default createConversation(stop)
