import { Collection, Db } from 'mongodb'
import { User } from '../domain/User'

export class UserRepository {
  private readonly collection: Collection<User>

  constructor(db: Db) {
    this.collection = db.collection('users')
  }

  async findByTelegramId(id: number) {
    return this.collection.findOne({ telegramId: id })
  }

  async create(
    id: number,
    key: string,
    city: string,
    name: string
  ): Promise<User> {
    await this.collection.insertOne({ telegramId: id, pixKey: key, city, name })

    return {
      telegramId: id,
      pixKey: key,
      city,
      name
    }
  }

  async setInfo(id: number, key: string, city: string, name: string) {
    return this.collection.updateOne(
      { telegramId: id },
      { $set: { pixKey: key, city, name } }
    )
  }
}
