import * as uuid from 'uuid'
import { pix } from 'pix-me'
import * as math from 'mathjs'
import { VercelRequest, VercelResponse } from '@vercel/node'

function evaluateValue(value: string) {
  try {
    const amount = math.evaluate(value)
    return amount
  } catch (err) {
    return null
  }
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const { method, body } = req

  if (method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).end()
  }

  if (method !== 'POST') return res.status(404).end()

  const { value, name, city, key } = body as Record<string, string>

  if ([value, name, city, key].some((value) => !value))
    return res.status(422).json({
      status: 422,
      error: {
        message: 'Informe o nome, cidade, chave pix e valor',
        code: 'missing_required_info'
      }
    })

  const amount = evaluateValue(value)

  const id = uuid.v4()

  const code = pix({
    amount,
    name,
    city,
    key
  })

  return res.status(200).json({ id, code })
}
