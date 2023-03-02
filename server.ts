import { serve } from "sift";

import { handleUpdate } from "./src/endpoints/bot.ts";
import { setWebhook } from "./src/endpoints/setWebhook.ts";
import { getQRCode } from "./src/endpoints/qrcode.ts";

serve({
  "/bot": handleUpdate,
  "/setWebhook": setWebhook,
  "/qrcode": getQRCode,
}, { port: Number(Deno.env.get("PORT") ?? "") || undefined });
