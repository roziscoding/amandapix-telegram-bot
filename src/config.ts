import 'dotenv/config'
import env from 'sugar-env'

export const config = {
  telegram: {
    token: env.get('TELEGRAM_TOKEN', '')
  },
  webhook: {
    url: env.get(['WEBHOOK_URL', 'VERCEL_URL'])
  },
  database: {
    uri: env.get('DATABASE_URI', 'mongodb://localhost:27017/amandapix'),
    dbName: env.get('DATABASE_DBNAME', 'amandapix')
  },
  env: env.get('NODE_ENV', 'development')
}

export type AppConfig = typeof config
