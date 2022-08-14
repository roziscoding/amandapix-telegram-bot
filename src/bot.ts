import { Bot, Context, session, SessionFlavor } from 'grammy'
import { start } from './commands'
import { cancel } from './commands/cancel'
import { AppConfig } from './config'
import { WizardFlavor, wizards } from './util/wizard'
import setInfo from './wizards/set-info'

export type AppSession = {
  pixKey: string
  city: string
  name: string
  query?: string
}

export type AppContext = Context & SessionFlavor<AppSession> & WizardFlavor

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

  bot.use(...wizards([setInfo]))

  bot.command(cancel.name, cancel.fn)
  bot.command(start.name, start.fn)

  return bot
}
