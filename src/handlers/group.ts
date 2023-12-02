import { AppContext } from "../bot.ts";
import { ChatMemberUpdated, Composer, InlineKeyboard } from "../deps.ts";
import { Group } from "../domain/Group.ts";
import { hasHydratedGroup } from "../middleware/group-instance.ts";

const helloText = `
Fala galera!
Cheguei pra ajudar vocês a gerenciarem as contas do grupo.
Primeiro, preciso que todo mundo clique no botão abaixo pra se cadastrar.
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

hydratedComposer
  .callbackQuery("join", async (ctx) => {
    if (ctx.group.has(ctx.from)) return ctx.answerCallbackQuery("Já te conheço, jovem 👍");
    ctx.group.addMember(ctx.from);

    const keyboard = ctx.callbackQuery.message?.reply_markup;

    const newMessage = [
      helloText,
      "",
      "Membros cadastrados:",
      ...ctx.group.members.map((member) => `- ${member.firstName}`),
    ].join("\n");

    await Promise.all([
      ctx.editMessageText(newMessage, { reply_markup: keyboard }),
      ctx.answerCallbackQuery("Pronto, agora eu te conheço :)"),
    ]);
  });

hydratedComposer
  .on("my_chat_member", (_, next) => {
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

composer
  .on("my_chat_member")
  .filter((ctx) => left(ctx.myChatMember))
  .use(async (ctx, next) => {
    await next();
    ctx.session.group = Group.empty;
  });

export default composer;
