import { MongoClient } from 'mongodb'
export type Target = {
  key: string
  value: {
    pixKey: string
    city: string
    name: string
    query: string
  }
}

export type Origin = {
  telegramId: number
  pixKey: string
  city: string
  name: string
}

function convert(origin: Origin): Target {
  return {
    key: origin.telegramId.toString(),
    value: {
      pixKey: origin.pixKey,
      city: origin.city,
      name: origin.name,
      query: ''
    }
  }
}

const DB_URI = process.env.DB_URI ?? ''
const PROD_DBNAME = 'amandapix'

async function main() {
  const client = new MongoClient(DB_URI)
  await client.connect()
  const db = client.db(PROD_DBNAME)
  const users = db.collection<Origin>('users')
  const sessions = db.collection<Target>('sessions')

  const migrated = await users
    .find({})
    .toArray()
    .then((users) => users.filter((user) => user.pixKey))
    .then((users) => users.map(convert))

  await sessions.insertMany(migrated)

  await client.close()
}

main()
  .then(() => {
    console.log('Done')
  })
  .catch(console.error)
