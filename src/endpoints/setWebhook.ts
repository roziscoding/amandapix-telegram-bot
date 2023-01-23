import { Api } from "https://deno.land/x/grammy@v1.13.1/mod.ts";
import { config } from "../config.ts";

export async function setWebhook() {
  const api = new Api(config.telegram.token);

  await api.setWebhook(`https://${config.webhook.url}/bot`, {
    secret_token: config.telegram.secret,
  });

  return new Response(undefined, { status: 204 });
}
