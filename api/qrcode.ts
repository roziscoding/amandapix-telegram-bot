import { v4 as generateUuid } from 'uuid'
import { promisify } from 'util'
import { QRCodeSegment, toDataURL } from 'qrcode'
import { VercelRequest, VercelResponse } from '@vercel/node'
import pngToJpeg from 'png-to-jpeg'
import { Db, MongoClient } from 'mongodb'
import { config } from '../src/config'
import { QRCodeRepository } from '../src/repositories/qrcodes'

const createQrCode = promisify<string | QRCodeSegment[], string>(toDataURL)

let db: Db = null as any

async function createCode(repository: QRCodeRepository, pixCode: string, telegramId: number) {
  const uuid = generateUuid()

  const base64Data = await createQrCode([{ data: pixCode as string, mode: 'byte' }])
    .then((url) => url.split(',')[1])
    .then((base64) => Buffer.from(base64!, 'base64'))
    .then((buffer) => pngToJpeg({ quality: 100 })(buffer))
    .then((buffer) => buffer.toString('base64'))

  return repository.create(telegramId, uuid, base64Data)
}

export default async function (req: VercelRequest, res: VercelResponse) {
  if (!db) {
    db = await MongoClient.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((connection) => connection.db(config.database.dbName))
  }

  const qrCodeRepository = new QRCodeRepository(db)

  if (req.method === 'POST' && req.headers.authorization === config.telegram.token) {
    const { pixCode, telegramId } = req.query

    const { codeId } = await createCode(
      qrCodeRepository,
      pixCode as string,
      Number(telegramId as string)
    )

    return res.status(201).json({ codeId })
  }

  if (req.method === 'GET' && req.query.codeId) {
    const qrCode = await qrCodeRepository.findByCodeId(req.query.codeId as string)

    if (!qrCode) return res.status(404).end()

    const qrCodeBuffer = Buffer.from(qrCode.base64Data, 'base64')

    res.setHeader('Content-Type', 'image/jpeg')
    return res.status(200).send(qrCodeBuffer)
  }

  return res.status(401).end()
}
