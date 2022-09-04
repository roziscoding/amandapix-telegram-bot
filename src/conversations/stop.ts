import { Conversation, createConversation } from '@grammyjs/conversations'
import { InlineKeyboard } from 'grammy'
import { AppContext } from '../bot'

const stop = async (conversation: Conversation<AppContext>, ctx: AppContext) => {
  await ctx.reply('Deseja realmente apagar todos os seus dados?', {
    reply_markup: new InlineKeyboard().text('Sim', 'y').text('Não', 'n')
  })

  const [confirmation, newContext] = await conversation
    .waitFor('callback_query:data')
    .then(async (ctx) => {
      await ctx.deleteMessage()
      return ctx
    })
    .then((ctx) => {
      return [ctx.callbackQuery.data === 'y', ctx] as const
    })

  if (!confirmation) {
    return ctx.reply('Beleza, não vou apagar nada então.')
  }

  newContext.session = undefined

  return ctx.reply('Pronto. Excluí todos os dados que eu tinha sobre você')
}

export default createConversation(stop)
