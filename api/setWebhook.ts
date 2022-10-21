import { VercelRequest, VercelResponse } from '@vercel/node'
import { Api } from 'grammy'
import { config } from '../src/config'

export default async function (_req: VercelRequest, res: VercelResponse) {
  const api = new Api(config.telegram.token)

  await api.setWebhook(`https://${config.webhook.url}/api/bot`, { secret_token: config.telegram.secret })

  return res.status(204).end()
}
