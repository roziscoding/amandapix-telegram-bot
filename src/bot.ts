import { ConversationFlavor, conversations as grammyConversations } from '@grammyjs/conversations'
import { FileAdapter } from '@grammyjs/storage-file'
import { Bot, Context, session, SessionFlavor } from 'grammy'
import { MongoClient } from 'mongodb'

import * as commands from './commands'
import { AppConfig } from './config'
import * as conversations from './conversations'
import * as handlers from './handlers'
import { qrCodeUrl, QRCodeUrlContext } from './util/qr-code-url'
import { ISession, MongoDBAdapter } from './util/storage-adapter'

export type AppSession = {
  pixKey: string
  city: string
  name: string
  query?: string
}

export type AppContext = Context & ConversationFlavor & SessionFlavor<AppSession> & QRCodeUrlContext

async function getStorage(config: AppConfig) {
  if (config.env !== 'production') return new FileAdapter<AppSession>({ dirName: 'sessions' })

  const client = new MongoClient(config.database.uri)
  await client.connect()
  const db = client.db(config.database.dbName)
  const sessions = db.collection<ISession>('sessions')

  return new MongoDBAdapter<AppSession>({
    collection: sessions
  })
}

export async function getBot(config: AppConfig) {
  const bot = new Bot<AppContext>(config.telegram.token)

  bot.use(qrCodeUrl(config))

  bot.use(
    session({
      getSessionKey: (ctx) => ctx.from?.id.toString(),
      initial: () => ({
        pixKey: '',
        city: '',
        name: ''
      }),
      storage: await getStorage(config)
    })
  )

  bot.use(grammyConversations())

  /** Cancel Command */
  bot.command(commands.cancel.name, commands.cancel.fn)

  /** Conversations */
  for (const conversation of Object.values(conversations)) {
    bot.use(conversation)
  }

  /** Regular commands */
  for (const command of Object.values(commands)) {
    if (command.name === 'cancel') continue
    bot.command(command.name, command.fn)
  }

  /** Inline query handlers */
  for (const handler of Object.values(handlers)) {
    handler.install(bot)
  }

  bot.catch(console.error)

  return bot
}
