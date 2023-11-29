import { AppContext } from "../bot.ts";
import { Composer } from "../deps.ts";
import { hasHydratedGroup } from "../middleware/group-instance.ts";
import { BRL } from "../util/currency.ts";

export const debts = new Composer<AppContext>();

debts
  .filter(hasHydratedGroup)
  .command("debitos")
  .use((ctx) => {
    const debts = ctx.group.getAllDebts();

    if (debts.length === 0) {
      return ctx.reply("O grupo não possui nenhuma despesa registrada");
    }

    const total = debts.reduce((acc, debt) => acc + debt.amount, 0);

    const message = debts.map((debt) => {
      const creditor = debt.from.username ? `@${debt.from.username}` : debt.from.firstName;
      const debtor = debt.to.username ? `@${debt.to.username}` : debt.to.firstName;
      const amount = BRL(debt.amount);

      return `${debtor} deve <b>${amount}</b> para ${creditor}`;
    }).join("\n");

    ctx.reply(`Despesas do grupo:\n\n${message}\n\nTotal: <b>${total}</b>`, { parse_mode: "HTML" });
  });
