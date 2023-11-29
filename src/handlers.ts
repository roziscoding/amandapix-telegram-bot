import { AppContext } from "./bot.ts";
import { Composer } from "./deps.ts";
import cancel from "./handlers/cancel.ts";
import done from "./handlers/done.ts";
import group from "./handlers/group.ts";
import registered from "./handlers/registered.ts";
import stop from "./handlers/stop.ts";
import unregistered from "./handlers/unregistered.ts";

const composer = new Composer<AppContext>();

composer.use(done);
composer.use(registered);
composer.use(unregistered);
composer.use(stop);
composer.use(cancel);
composer.use(group);

export default composer;
