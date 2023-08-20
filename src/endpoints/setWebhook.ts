import { config } from "../config.ts";
import { Api } from "../deps.ts";

export async function setWebhook() {
  const api = new Api(config.TELEGRAM_TOKEN);

  await api.setWebhook(`https://${config.WEBHOOK_URL}/bot`, {
    secret_token: config.WEBHOOK_SECRET,
  });

  return new Response(undefined, { status: 204 });
}
