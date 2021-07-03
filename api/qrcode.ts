import { promisify } from 'util'
import { QRCodeSegment, toDataURL } from 'qrcode'
import { VercelRequest, VercelResponse } from '@vercel/node'
import pngToJpeg from 'png-to-jpeg'
import { Db, MongoClient } from 'mongodb'
import { config } from '../src/config'
import { UserRepository } from '../src/repositories/users'
import { pix } from 'pix-me'

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
  const value = req.query.value

  if (isNaN(telegramId) || !value || typeof value !== 'string') {
    return res.status(403).end()
  }

  const userRepository = new UserRepository(db)

  const user = await userRepository.findByTelegramId(Number(req.query.telegramId))

  if (!user) {
    return res.status(401).end()
  }

  const pixCode = pix({
    key: user.pixKey,
    amount: value,
    city: user.city,
    name: user.name
  })

  const buffer = await createQrCode([{ data: pixCode as string, mode: 'byte' }])
    .then((url) => url.split(',')[1])
    .then((base64) => Buffer.from(base64!, 'base64'))
    .then((buffer) => pngToJpeg({ quality: 100 })(buffer))

  res.setHeader('Content-Type', 'image/jpeg')
  res.status(200).send(buffer)
}
