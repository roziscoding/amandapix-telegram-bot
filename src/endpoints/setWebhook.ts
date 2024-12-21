import { config } from "../config.ts";
import { Api } from "../deps.ts";

export async function setWebhook() {
  const api = new Api(config.TELEGRAM_TOKEN);
  const webhookUrl = new URL(config.WEBHOOK_URL);
  webhookUrl.pathname = "/bot";

  await api.setWebhook(webhookUrl.toString(), {
    secret_token: config.WEBHOOK_SECRET,
  });

  return new Response(undefined, { status: 204 });
}
