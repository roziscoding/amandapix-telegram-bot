import { AppContext } from "../bot.ts";

export type Command = {
  name: string;
  helpText?: string;
  fn: (ctx: AppContext) => unknown;
};
