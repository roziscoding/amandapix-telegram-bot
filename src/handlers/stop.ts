import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";

const composer = new Composer<AppContext>();

composer.callbackQuery("stop", (ctx) => {
  ctx.session = {
    name: "",
    pixKey: "",
    query: "",
    city: "",
    onboarded: false,
    conversation: undefined,
  };

  return ctx.editMessageText("Pronto. Excluí todos os dados que eu tinha sobre você! Até a próxima.", {
    reply_markup: undefined,
  });
});

export default composer;
