import { Composer } from "grammy";
import { AppContext } from "./bot.ts";
import cancel from "./handlers/cancel.ts";
import done from "./handlers/done.ts";
import registered from "./handlers/registered.ts";
import stop from "./handlers/stop.ts";
import unregistered from "./handlers/unregistered.ts";

const composer = new Composer<AppContext>();

composer.use(done);
composer.use(registered);
composer.use(unregistered);
composer.use(stop);
composer.use(cancel);

export default composer;
