import type { Context, MiddlewareFn } from "../deps.ts";
import { encodeBase64 } from "../deps.ts";

export type QRCodeUrlFlavor = {
  getQrCodeUrl: (pixCode: string) => string;
};

export const qrCodeUrl: MiddlewareFn<Context & QRCodeUrlFlavor> = async (ctx, next) => {
  ctx.getQrCodeUrl = (pixCode) => `https://t.me/${ctx.me.username}/qrcode?startapp=${encodeBase64(pixCode)}`;
  await next();
};
