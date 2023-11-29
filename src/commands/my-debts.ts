import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";
import { hasHydratedGroup } from "../middleware/group-instance.ts";
import { BRL } from "../util/currency.ts";

export const myDebts = new Composer<AppContext>();

myDebts
  .filter(hasHydratedGroup)
  .command("meusdebitos")
  .use((ctx) => {
    if (!ctx.from) return;

    const debts = ctx.group.getDebts(ctx.from);

    if (debts.length === 0) {
      return ctx.reply("Você não tem nenhuma dívida com o grupo!");
    }

    const total = debts.reduce((acc, debt) => acc + debt.amount, 0);

    const message = debts.map((debt) => {
      const creditor = debt.to.username ? `@${debt.to.username}` : `<b>${debt.to.firstName}</b>`;
      return `- ${creditor} te emprestou ${BRL(debt.amount)}`;
    }).join("\n");

    ctx.reply(`Você tem um total de <b>${BRL(total)}</b> em dívidas com o grupo:\n\n${message}`, {
      parse_mode: "HTML",
    });
  });
