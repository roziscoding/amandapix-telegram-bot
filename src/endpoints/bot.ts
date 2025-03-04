import { Environment, getBot } from "../bot.ts";
import { AppConfig } from "../config.ts";
import { Axiom, webhookCallback } from "../deps.ts";

function sanitizeHeaders(headers: Headers) {
  return Object.fromEntries(
    headers.entries().filter(([key]) => key.toLowerCase() !== "x-telegram-bot-api-secret-token"),
  );
}

function formatError(err: unknown) {
  if (err instanceof Error) {
    return {
      message: err.message,
      stack: err.stack,
      name: err.name,
      cause: err.cause,
    };
  }

  return JSON.stringify(err);
}

export async function getUpdateHandler(config: AppConfig) {
  const bot = await getBot(config, Environment.Production);

  if (!config.AXIOM_TOKEN) {
    console.warn("AXIOM_TOKEN is not set, skipping Axiom ingestion");
    return (req: Request) =>
      webhookCallback(bot, "std/http", { secretToken: config.WEBHOOK_SECRET })(req)
        .catch((error) => {
          console.error(error);
          return new Response(null, { status: 200 });
        });
  }

  const axiom = new Axiom({
    token: config.AXIOM_TOKEN,
  });

  return async function handleUpdate(originalRequest: Request) {
    const clonedRequest = originalRequest.clone();
    const logInfo: Record<string, unknown> = {
      request: {
        url: clonedRequest.url,
        method: clonedRequest.method,
        headers: sanitizeHeaders(clonedRequest.headers),
        body: await clonedRequest.json(),
      },
      start: new Date(),
    };

    try {
      const response = await webhookCallback(bot, "std/http", {
        secretToken: config.WEBHOOK_SECRET,
      })(originalRequest);

      const clonedResponse = response.clone();
      logInfo.result = "success";
      logInfo.response = {
        body: await clonedResponse.text(),
        status: clonedResponse.status,
      };

      return response;
    } catch (err) {
      logInfo.result = "error";
      logInfo.error = formatError(err);
      console.error(err);

      return new Response(undefined, { status: 200 });
    } finally {
      logInfo.end = new Date();
      axiom.ingest(config.AXIOM_DATASET, logInfo);
      axiom.flush().catch((err) => {
        console.error(err);
      });
    }
  };
}
