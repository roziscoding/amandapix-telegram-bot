import { VercelRequest, VercelResponse } from '@vercel/node'
import { format } from 'util'
import { config } from '../src/config'
import { makeRequest } from '../src/util/makeRequest'

export async function getMe () {
  const url = format('https://api.telegram.org/bot%s/getMe', config.telegram.token)

  return JSON.parse(await makeRequest(url))
}

export default async function (_req: VercelRequest, res: VercelResponse) {
  res.status(200).send(await getMe())
}
