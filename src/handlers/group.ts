import { AppContext } from "../bot.ts";
import { ChatMemberUpdated, Composer, InlineKeyboard } from "../deps.ts";
import { hasHydratedGroup } from "../middleware/group-instance.ts";

const helloText = `
Fala galera!
Cheguei pra ajudar vocês a gerenciarem as contas do grupo.
Primeiro, preciso que todo mundo clique no botão abaixo pra eu conhecer todo mundo.

Enviem /done quando todos tiverem feito isso.
`.trim();

const joined = (chatMember: ChatMemberUpdated) => {
  return ["member", "creator", "administrator"]
    .includes(chatMember.new_chat_member.status);
};

const left = (chatMember: ChatMemberUpdated) => {
  return !joined(chatMember);
};

const composer = new Composer<AppContext>();
const hydratedComposer = composer.filter(hasHydratedGroup);

hydratedComposer.callbackQuery("join", (ctx) => {
  ctx.group.addMember(ctx.from);
  return ctx.answerCallbackQuery("Pronto, agora eu te conheço :)");
});

hydratedComposer
  .on("my_chat_member", (_, next) => {
    console.log("got event");
    return next();
  })
  .filter((ctx) => joined(ctx.myChatMember))
  .use((ctx) => {
    return ctx.reply(helloText, {
      reply_markup: new InlineKeyboard().text("Entrar no Grupo", "join"),
    });
  });

hydratedComposer
  .on("chat_member")
  .filter((ctx) => joined(ctx.chatMember))
  .use((ctx, next) => {
    ctx.group.addMember(ctx.chatMember.new_chat_member.user);
    return next();
  });

hydratedComposer
  .on("chat_member")
  .filter((ctx) => left(ctx.chatMember))
  .use((ctx, next) => {
    ctx.group.removeMember(ctx.chatMember.old_chat_member.user);
    return next();
  });

export default composer;
