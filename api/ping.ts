import { VercelRequest, VercelResponse } from '@vercel/node'

export default function (req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    message: 'pong!',
    body: req.body,
    query: req.query
  })
}