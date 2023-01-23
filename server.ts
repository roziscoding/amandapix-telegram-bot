import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";

import { handleUpdate } from "./src/endpoints/bot.ts";
import { setWebhook } from "./src/endpoints/setWebhook.ts";
import { getQRCode } from "./src/endpoints/qrcode.ts";

serve({
  "/bot": handleUpdate,
  "/setWebhook": setWebhook,
  "/qrcode": getQRCode,
}, { port: Number(Deno.env.get("PORT") ?? "") || undefined });
