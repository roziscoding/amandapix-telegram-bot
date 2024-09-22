import { AppContext, AppSession } from "../bot.ts";
import { DenoKVAdapter, session } from "../deps.ts";

export const sessionMiddleware = (kv: Deno.Kv) =>
  session<AppSession, AppContext>({
    getSessionKey: (ctx) => ctx.from?.id.toString(),
    initial: () => ({
      pixKey: "",
      city: "",
      name: "",
      onboarded: false,
    }),
    storage: new DenoKVAdapter<AppSession>(kv),
  });
