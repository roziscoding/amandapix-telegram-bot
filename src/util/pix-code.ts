import { pix } from "https://deno.land/x/pix@v2.0.6/mod.ts";
import { AppSession } from "../bot.ts";

const normalize = (value: string) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function getPixCodeForUser(user: AppSession, value: string | number) {
  return pix({
    key: user.pixKey,
    amount: typeof value === "number" ? value.toFixed(2) : value,
    city: normalize(user.city),
    name: normalize(user.name),
  });
}
