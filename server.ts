import { serve } from "./src/deps.ts";
import { handleUpdate } from "./src/endpoints/bot.ts";
import { miniapp } from "./src/endpoints/miniapp.ts";
import { getQRCode } from "./src/endpoints/qrcode.ts";
import { setWebhook } from "./src/endpoints/setWebhook.ts";

serve({
  "/bot": handleUpdate,
  "/setWebhook": setWebhook,
  "/qrcode": getQRCode,
  "/miniapp": miniapp,
}, { port: Number(Deno.env.get("PORT") ?? "") || undefined });
