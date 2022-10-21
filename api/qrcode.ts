import { VercelRequest, VercelResponse } from '@vercel/node'
import { QRCodeSegment, toDataURL } from 'qrcode'
import { promisify } from 'util'
import { pngToJpeg } from '../src/util/image'

const createQrCode = promisify<string | QRCodeSegment[], string>(toDataURL)

export default async function (req: VercelRequest, res: VercelResponse) {
  const pixCode = req.query.pixCode

  if (!pixCode) return res.status(422).json({ message: 'missing pixCode param' })
  if (Array.isArray(pixCode)) return res.status(422).json({ message: 'more than one pixCode provided' })

  const buffer = await createQrCode([{ data: Buffer.from(pixCode), mode: 'byte' }])
    .then((url) => url.split(',')[1])
    .then((base64) => Buffer.from(base64!, 'base64'))
    .then((buffer) => pngToJpeg(buffer))

  res.setHeader('Content-Type', 'image/jpeg')
  return res.status(200).send(buffer)
}
