import { AppContext } from "../bot.ts";
import { Composer, Context } from "../deps.ts";
import { hasHydratedGroup } from "../middleware/group-instance.ts";
import { BRL } from "../util/currency.ts";

export const expense = new Composer<AppContext>();

expense
  .filter(hasHydratedGroup)
  .filter(Context.has.filterQuery("message:text"))
  .use((ctx) => {
    if (!ctx.from) return;

    const amount = ctx.message.text.split(" ")[1];

    if (!amount) {
      return ctx.reply("Você precisa informar o valor da despesa. Por exemplo: <code>/despesa 10</code>", {
        parse_mode: "HTML",
      });
    }

    ctx.group.addExpense(ctx.from, Number(amount));

    ctx.reply(`Despesa de ${BRL(amount)} adicionada com sucesso!`);
  });
