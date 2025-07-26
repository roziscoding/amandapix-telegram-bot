import { Composer } from "grammy";
import { AppContext } from "../bot.ts";

const composer = new Composer<AppContext>();

composer.callbackQuery("stop", (ctx) => {
  ctx.session = {
    name: "",
    pixKey: "",
    query: "",
    city: "",
    onboarded: false,
  };

  return ctx.editMessageText("Pronto. Excluí todos os dados que eu tinha sobre você! Até a próxima.", {
    reply_markup: undefined,
  });
});

export default composer;
