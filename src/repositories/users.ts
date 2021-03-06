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

  async setSesstion(id: number, command?: string, data?: any) {
    if (!command) {
      return this.collection.updateOne(
        { telegramId: id },
        { $unset: { session: 1 } }
      )
    }

    return this.collection.updateOne(
      { telegramId: id },
      { $set: { session: { command, data } } }
    )
  }

  async clearSession(id: number) {
    return this.setSesstion(id)
  }

  async forget(id: number) {
    return this.collection.deleteOne({ telegramId: id })
  }
}
