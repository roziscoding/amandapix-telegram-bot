import { VercelRequest, VercelResponse } from '@vercel/node'
import { Db, MongoClient } from 'mongodb'
import { Message, Update } from 'typegram'
import { handleInlineQuery, handleMessage } from '../src'
import { config } from '../src/config'
import { UserRepository } from '../src/repositories/users'

type ValidUpdate = Update.InlineQueryUpdate | Update.MessageUpdate

let db: Db = null as any

const isInlineQuery = (update: any): update is Update.InlineQueryUpdate => {
  return !!update.inline_query
}

const isMessage = (
  update: any
): update is Update.MessageUpdate & { message: Message.TextMessage } => {
  return !!update.message && !!update.message.text
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
  const update: ValidUpdate = req.body

  if (!isValidUpdate(update)) return res.status(403).end()

  if (!db) {
    db = await MongoClient.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((connection) => connection.db(config.database.dbName))
  }

  const userRepository = new UserRepository(db)

  const user =
    (await userRepository.findByTelegramId(extractTelegramId(update))) ||
    (await userRepository.create(extractTelegramId(update), '', '', ''))

  if (isInlineQuery(update)) {
    return res
      .status(200)
      .json(await handleInlineQuery(user, update.inline_query))
  }

  if (isMessage(update)) {
    const result = await handleMessage(user, userRepository, update.message)

    if (result) return res.status(200).json(result)

    return res.status(204).end()
  }

  return res.status(204).end()
}
