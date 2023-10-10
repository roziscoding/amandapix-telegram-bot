import { AppContext } from "./bot.ts";
import { Composer } from "./deps.ts";

import setInfo from "./conversations/set-info.ts";

const composer = new Composer<AppContext>();

composer.use(setInfo);

export default composer;
