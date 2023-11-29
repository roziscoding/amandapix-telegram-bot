import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";
import { Group } from "../domain/Group.ts";

export type GroupFlavor = {
  group?: Group;
};

const composer = new Composer<AppContext>();

composer.chatType(["group", "supergroup"])
  .use(async (ctx, next) => {
    const group = ctx.session.group ? Group.hydrate(ctx.session.group) : new Group();

    Object.defineProperty(ctx, "group", {
      enumerable: false,
      configurable: false,
      writable: false,
      value: group,
    });

    await next();

    ctx.session.group = group.serialize();
  });

export const hasHydratedGroup = <T extends AppContext>(ctx: T): ctx is T & { group: Group } => {
  return !!ctx.group;
};

export default composer;
