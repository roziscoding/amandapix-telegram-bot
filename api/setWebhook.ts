import { VercelRequest, VercelResponse } from '@vercel/node'
import { format } from 'util'
import { config } from '../src/config'
import { makeRequest } from '../src/util/makeRequest'

export default async function (_req: VercelRequest, res: VercelResponse) {
  const webhookUrl = `https://${config.webhook.url}/api/${config.telegram.token}`

  const url = format(
    'https://api.telegram.org/bot%s/setWebhook?url=%s',
    config.telegram.token,
    webhookUrl,
  )

  const response = JSON.parse(await makeRequest(url))

  res.status(200).send({ response, url: webhookUrl })
}
