import { config } from "../config.ts";
import { Api } from "../deps.ts";

export async function setWebhook(req: Request) {
  const api = new Api(config.TELEGRAM_TOKEN);
  const webhookUrl = new URL(config.WEBHOOK_URL);
  webhookUrl.pathname = "/bot";

  const token = await req
    .json()
    .then(({ token }) => token)
    .catch(() => null);

  if (token !== config.TELEGRAM_TOKEN) {
    return new Response(undefined, { status: 401 });
  }

  await api.setWebhook(webhookUrl.toString(), {
    secret_token: config.WEBHOOK_SECRET,
    drop_pending_updates: true,
  });

  return new Response(undefined, { status: 204 });
}
