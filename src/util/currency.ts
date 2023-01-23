const ensureNumber = (value: string | number) =>
  typeof value === "string" ? Number(value) : value;

export const BRL = (amount: number | string) =>
  ensureNumber(amount).toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
    minimumFractionDigits: 2,
  });
