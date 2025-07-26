import { DenoKVAdapter } from "@grammyjs/storages/denokv/src/adapter.ts";
import { session } from "grammy";
import { AppContext, AppSession } from "../bot.ts";

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
