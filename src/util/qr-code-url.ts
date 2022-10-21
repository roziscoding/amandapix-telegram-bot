import { Context, MiddlewareFn } from 'grammy'
import { AppConfig } from '../config'

export type QRCodeUrlContext = Context & { getQrCodeUrl: (pixCode: string) => string }

export const qrCodeUrl =
  (config: AppConfig): MiddlewareFn<QRCodeUrlContext> =>
  (ctx, next) => {
    ctx.getQrCodeUrl = (pixCode) => `${config.webhook.url}/api/qrcode?pixCode=${pixCode}`
    return next()
  }
