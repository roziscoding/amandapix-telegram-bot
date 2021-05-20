import { VercelRequest, VercelResponse } from '@vercel/node'
import https from 'https'
import { format } from 'util'
import { config } from '../src/config'

const makeRequest = (url: string) =>
  new Promise((resolve, reject) => {
    const request = https.request(
      url,
      {
        headers: {
          'content-type': 'application/json',
          accept: 'application/json'
        }
      },
      (res) => {
        const responseData: Buffer[] = []

        res.on('data', (chunk) => {
          responseData.push(chunk)
        })

        res.on('end', () => {
          resolve(Buffer.concat(responseData).toString('utf-8'))
        })
      }
    )

    request.on('error', reject)
    request.end()
  })

export default async function (_req: VercelRequest, res: VercelResponse) {
  const webhookUrl = config.webhook.url

  const url = format(
    'https://api.telegram.org/bot%s/setWebhook?url=https://%s/api/%s',
    config.telegram.token,
    webhookUrl,
    config.telegram.token
  )

  console.log(url)

  const response = await makeRequest(url)

  res.status(200).send(response)
}
