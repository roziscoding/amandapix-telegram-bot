import type { Context, MiddlewareFn } from "https://deno.land/x/grammy@v1.13.1/mod.ts";
import { AppConfig } from "../config.ts";

export type QRCodeUrlContext = Context & {
  getQrCodeUrl: (pixCode: string) => string;
};

export const qrCodeUrl = (config: AppConfig): MiddlewareFn<QRCodeUrlContext> => async (ctx, next) => {
  ctx.getQrCodeUrl = (pixCode) => `${config.webhook.url}/qrcode?pixCode=${pixCode}`;
  await next();
};
