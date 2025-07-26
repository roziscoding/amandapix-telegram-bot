import type { Context, MiddlewareFn } from "grammy";
import { encodeBase64 } from "jsr:@std/encoding";

export type QRCodeUrlFlavor = {
  getQrCodeUrl: (pixCode: string) => string;
};

export const qrCodeUrl: MiddlewareFn<Context & QRCodeUrlFlavor> = async (ctx, next) => {
  ctx.getQrCodeUrl = (pixCode) => `https://t.me/${ctx.me.username}/qrcode?startapp=${encodeBase64(pixCode)}`;
  await next();
};
