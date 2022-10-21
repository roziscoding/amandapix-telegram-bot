import { VercelRequest, VercelResponse } from '@vercel/node'
import { webhookCallback } from 'grammy'
import { getBot } from '../src/bot'
import { config } from '../src/config'

export default async (req: VercelRequest, res: VercelResponse) =>
  webhookCallback(await getBot(config), 'http', { secretToken: config.telegram.secret })(req, res)
