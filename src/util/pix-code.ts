import { pix } from "pix-me";
import { AppSession } from "../bot.ts";

const normalize = (value: string) => value.normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function getPixCodeForUser(user: AppSession, value: string | number) {
  return pix({
    key: user.pixKey,
    amount: typeof value === "number" ? value.toFixed(2) : value,
    city: normalize(user.city),
    name: normalize(user.name),
  });
}
