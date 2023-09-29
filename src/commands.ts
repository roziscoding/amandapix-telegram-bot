import { AppContext } from "./bot.ts";
import { getInfo } from "./commands/getInfo.ts";
import { privacy } from "./commands/privacy.ts";
import { repo } from "./commands/repo.ts";
import { setInfo } from "./commands/set-info.ts";
import { start } from "./commands/start.ts";
import { stop } from "./commands/stop.ts";
import { Commands } from "./deps.ts";

export const commands = new Commands<AppContext>();

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
