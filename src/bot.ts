import { ConversationFlavor, conversations as grammyConversations } from '@grammyjs/conversations'
import { Bot, Context, session, SessionFlavor } from 'grammy'
import * as commands from './commands'
import { AppConfig } from './config'
import * as conversations from './conversations'

export type AppSession = {
  pixKey: string
  city: string
  name: string
  query?: string
}

export type AppContext = Context & SessionFlavor<AppSession> & ConversationFlavor

export async function getBot(config: AppConfig) {
  const bot = new Bot<AppContext>(config.telegram.token)

  bot.use(
    session({
      getSessionKey: (ctx) => ctx.from?.id.toString(),
      initial: () => ({
        pixKey: '',
        city: '',
        name: ''
      })
    })
  )

  bot.use(grammyConversations())

  /** Cancel Command */
  bot.command(commands.cancel.name, commands.cancel.fn)

  /** Conversations */
  bot.use(conversations.setInfo)

  /** Regular commands */
  for (const command of Object.values(commands)) {
    if (command.name === 'cancel') continue
    bot.command(command.name, command.fn)
  }

  bot.catch(console.error)

  return bot
}
