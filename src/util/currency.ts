import { z } from "zod";

export class CurrencyNotFoundError extends Error {
  public readonly currency: string;

  constructor(originalMessage: string) {
    super();

    const currencyRegex = /moeda nao encontrada (?<currency>.*)/i;
    this.currency = originalMessage.match(currencyRegex)?.groups?.currency ??
      originalMessage;
  }
}

const currencySchema = z.object({
  code: z.string(),
  codein: z.string(),
  name: z.string(),
  high: z.string().transform(Number),
  low: z.string(),
  varBid: z.string(),
  pctChange: z.string(),
  bid: z.string(),
  ask: z.string(),
  timestamp: z.string(),
  create_date: z.string(),
});

const ensureNumber = (value: string | number) => typeof value === "string" ? Number(value) : value;

export const BRL = (amount: number | string) =>
  ensureNumber(amount).toLocaleString("pt-BR", {
    currency: "BRL",
    style: "currency",
    minimumFractionDigits: 2,
  });

export function getConversionRates(
  currencies: string[],
) {
  const BASE_URL = "https://economia.awesomeapi.com.br/last/";

  const currencyList = currencies
    .map((currency) => currency.toUpperCase())
    .filter((currency) => currency !== "BRL")
    .map((currency) => `${currency}-BRL`)
    .join(",");

  if (!currencyList) return {} as Record<string, number>;

  const url = new URL(currencyList, BASE_URL);

  return fetch(url)
    .then(async (response) => {
      const text = await response.text();
      const json = JSON.parse(text);
      if (!response.ok && json?.code === "CoinNotExists") {
        throw new CurrencyNotFoundError(text);
      }

      return json;
    })
    .then((currencyData) => {
      const rates = Object.entries(currencyData).map(([currencyName, currencyRate]) => [
        currencyName.replace(/BRL/ig, ""),
        currencySchema.parse(currencyRate).high,
      ]);

      return Object.fromEntries(rates) as Record<string, number>;
    });
}

export type CurrencyConverstionRates = Awaited<
  ReturnType<typeof getConversionRates>
>;
