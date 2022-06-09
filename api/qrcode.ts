import { promisify } from 'util'
import { QRCodeSegment, toDataURL } from 'qrcode'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { Db, MongoClient } from 'mongodb'
import { config } from '../src/config'
import { UserRepository } from '../src/repositories/users'
import { getPixCodeForUser } from '../src/util/pixCode'
import { pngToJpeg } from '../src/util/image'

const createQrCode = promisify<string | QRCodeSegment[], string>(toDataURL)

let db: Db = null as any

export default async function (req: VercelRequest, res: VercelResponse) {
  if (!db) {
    db = await MongoClient.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((connection) => connection.db(config.database.dbName))
  }

  const telegramId = Number(req.query.telegramId)
  const amount = req.query.value

  if (isNaN(telegramId) || !amount || typeof amount !== 'string') {
    return res.status(403).end()
  }

  const userRepository = new UserRepository(db)

  const user = await userRepository.findByTelegramId(Number(req.query.telegramId))

  if (!user) {
    return res.status(401).end()
  }

  const pixCode = getPixCodeForUser(user, amount)

  const buffer = await createQrCode([{ data: pixCode as string, mode: 'byte' }])
    .then((url) => url.split(',')[1])
    .then((base64) => Buffer.from(base64!, 'base64'))
    .then((buffer) => pngToJpeg(buffer))

  res.setHeader('Content-Type', 'image/jpeg')
  res.status(200).send(buffer)
}
