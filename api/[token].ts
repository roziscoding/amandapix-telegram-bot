import { VercelRequest, VercelResponse } from '@vercel/node'
import debug from 'debug'
import { Db, MongoClient } from 'mongodb'
import { Update } from 'typegram'
import { handleInlineQuery, handleMessage } from '../src'
import { config } from '../src/config'
import { UserRepository } from '../src/repositories/users'

type ValidUpdate = Update.InlineQueryUpdate | Update.MessageUpdate

const log = (namespace: string, message: string) =>
  debug('amandapix').extend(namespace)(message)

let db: Db = null as any

const isInlineQuery = (update: any): update is Update.InlineQueryUpdate => {
  return !!update.inline_query
}

const isMessage = (update: any): update is Update.MessageUpdate => {
  return !!update.message
}

const isValidUpdate = (update: any): update is ValidUpdate => {
  return isInlineQuery(update) || isMessage(update)
}

const extractTelegramId = (update: ValidUpdate) => {
  if (isInlineQuery(update)) return update.inline_query.from.id
  if (isMessage(update)) return update.message.from.id
  return 0
}

export default async function handleUpdate(
  req: VercelRequest,
  res: VercelResponse
) {
  const token = req.query.token
  const update: ValidUpdate = req.body

  if (!token || token !== config.telegram.token || !isValidUpdate(update))
    return res.status(403).end()

  if (!db) {
    log('db', 'Conectando ao mongodb')
    db = await MongoClient.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((connection) => connection.db(config.database.dbName))
  }

  const userRepository = new UserRepository(db)

  const user =
    (await userRepository.findByTelegramId(extractTelegramId(update))) ||
    (await userRepository.create(extractTelegramId(update), ''))

  if (isInlineQuery(update)) {
    return res
      .status(200)
      .json(await handleInlineQuery(user, update.inline_query))
  }

  if (isMessage(update)) {
    return res.status(200).json(await handleMessage(user, userRepository, update.message))
  }

  return res.status(204).end()
}
