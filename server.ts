import { serve } from "./src/deps.ts";

import { handleUpdate } from "./src/endpoints/bot.ts";
import { getQRCode } from "./src/endpoints/qrcode.ts";
import { setWebhook } from "./src/endpoints/setWebhook.ts";

serve({
  "/bot": handleUpdate,
  "/setWebhook": setWebhook,
  "/qrcode": getQRCode,
}, { port: Number(Deno.env.get("PORT") ?? "") || undefined });
