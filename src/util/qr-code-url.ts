import { AppConfig } from "../config.ts";
import type { Context, MiddlewareFn } from "../deps.ts";

export type QRCodeUrlFlavor = {
  getQrCodeUrl: (pixCode: string) => string;
};

export const qrCodeUrl = (config: AppConfig): MiddlewareFn<Context & QRCodeUrlFlavor> => async (ctx, next) => {
  ctx.getQrCodeUrl = (pixCode) => `https://${config.WEBHOOK_URL}/qrcode?pixCode=${pixCode}`;
  await next();
};
