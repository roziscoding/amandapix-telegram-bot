import { Db, MongoClient } from 'mongodb'
import { allowCors } from '../../src/util/allowCors'
import * as uuid from 'uuid'
import { pix } from 'pix-me'
import * as math from 'mathjs'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { CodeRepository } from '../../src/repositories/codes'
import { config } from '../../src/config'

let db: Db = null as any

function evaluateValue(value: string) {
  try {
    const amount = math.evaluate(value)
    return amount
  } catch (err) {
    return null
  }
}

const handler = async function (req: VercelRequest, res: VercelResponse) {
  const { method, body } = req

  if (!db) {
    db = await MongoClient.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((connection) => connection.db(config.database.dbName))
  }

  const codeRepository = new CodeRepository(db)

  if (method !== 'POST') return res.status(404).end()

  const { value, name, city, key } = body as Record<string, string>

  if ([value, name, city, key].some((value) => !value))
    return res.status(422).json({
      status: 422,
      error: {
        message: 'Informe o nome, cidade, chave pix e valor',
        code: 'missing_required_info'
      }
    })

  const amount = evaluateValue(value)

  const id = uuid.v4()

  const code = pix({
    amount,
    name,
    city,
    key
  })

  await codeRepository.create(id, code)

  return res.status(200).json({ id, code })
}

const endpoint = allowCors(handler)

export default endpoint
