import { Collection, Db } from 'mongodb'
import { Code } from '../domain/Code'

export class CodeRepository {
  private readonly collection: Collection<Code>

  constructor(db: Db) {
    this.collection = db.collection('qrcodes')
  }

  async create(codeId: string, encodedData: string): Promise<Code> {
    await this.collection.insertOne({ codeId, encodedData })

    return {
      codeId,
      encodedData
    }
  }

  async findByCodeId(codeId: string) {
    return this.collection.findOne({ codeId })
  }
}
