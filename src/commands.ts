import { AppContext } from "./bot.ts";
import { cancel } from "./commands/cancel.ts";
import { getInfo } from "./commands/getInfo.ts";
import { privacy } from "./commands/privacy.ts";
import { repo } from "./commands/repo.ts";
import { setInfo } from "./commands/set-info.ts";
import { start } from "./commands/start.ts";
import { stop } from "./commands/stop.ts";
import { Api, CommandGroup, InlineKeyboard } from "./deps.ts";

export const priorityCommands = new CommandGroup<AppContext>();

priorityCommands
  .command("cancel", "Cancela a operação atual")
  .addToScope({ type: "default" }, cancel);

export const commands = new CommandGroup<AppContext>();

commands
  .command("start", "Cria seu cadastro, caso ainda não exista")
  .addToScope({ type: "default" }, start);

commands
  .command("stop", "Apaga todos os dados que eu tenho armazenados sobre você")
  .addToScope({ type: "default" }, stop);

commands
  .command("setinfo", "Definir ou alterar suas informações")
  .addToScope({ type: "default" }, setInfo);

commands
  .command("getinfo", "Exibe todas as informações que eu tenho sobre você")
  .addToScope({ type: "default" }, getInfo);

commands
  .command("privacy", "Envia o link da política de privacidade do bot")
  .addToScope({ type: "default" }, privacy);

commands
  .command("repo", "Envia o link do repositório do bot")
  .addToScope({ type: "default" }, repo);

commands.command("webapp", "Opens the web app")
  .addToScope({ type: "default" }, (ctx) => {
    ctx.reply("WebApp test", {
      reply_markup: new InlineKeyboard().webApp(
        "Open WebApp",
        `https://chatbot.roz.ninja/miniapp?pixcode=${encodeURIComponent(
          "00020126350014br.gov.bcb.pix0113pix@roz.ninja520400005303986540539.905802BR5914Rogerio Munhoz6011Joao Pessoa62070503***630432F6",
        )
        }`,
      ),
    });
  });

export const setMyCommands = async ({ api }: { api: Api }) => {
  const args = [
    ...priorityCommands.toArgs().scopes,
    ...commands.toArgs().scopes,
  ];

  for (const arg of args) {
    await api.setMyCommands(arg.commands, {
      scope: arg.scope,
      language_code: arg.language_code,
    });
  }
};
