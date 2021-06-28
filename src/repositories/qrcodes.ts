import { Collection, Db } from 'mongodb'
import { QRCode } from '../domain/QRCode'

export class QRCodeRepository {
  private readonly collection: Collection<QRCode>

  constructor(db: Db) {
    this.collection = db.collection('qrcodes')
  }

  async findByTelegramId(id: number) {
    return this.collection.findOne({ telegramId: id })
  }

  async create(
    telegramId: number,
    codeId: string,
    base64Data: string
  ): Promise<QRCode> {
    await this.collection.insertOne({ telegramId, codeId, base64Data })

    return {
      telegramId,
      codeId,
      base64Data
    }
  }

  async findByCodeId (codeId: string) {
    return this.collection.findOne({ codeId })
  }
}
