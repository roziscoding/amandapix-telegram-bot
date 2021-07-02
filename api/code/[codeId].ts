import { Db, MongoClient } from 'mongodb'
import { allowCors } from '../../src/util/allowCors'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { CodeRepository } from '../../src/repositories/codes'
import { config } from '../../src/config'

let db: Db = null as any

const handler = async function (req: VercelRequest, res: VercelResponse) {
  if (!db) {
    db = await MongoClient.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then((connection) => connection.db(config.database.dbName))
  }

  const codeRepository = new CodeRepository(db)

  const code = await codeRepository.findByCodeId(req.query.codeId! as string)

  if (!code) {
    return res.status(404).end()
  }

  return res.status(200).json(code)
}

const endpoint = allowCors(handler)

export default endpoint
