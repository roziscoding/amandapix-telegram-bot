import { VercelRequest, VercelResponse } from '@vercel/node'
import { format } from 'util'
import { config } from '../src/config'
import { makeRequest } from '../src/util/makeRequest'

export default async function (_req: VercelRequest, res: VercelResponse) {
  const url = format('https://api.telegram.org/bot%s/getMe', config.telegram.token)

  const response = JSON.parse(await makeRequest(url))

  res.status(200).send(response)
}
