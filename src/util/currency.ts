import { z } from "https://deno.land/x/zod@v3.20.5/mod.ts";

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

export function getConversionRates<Rates extends readonly string[]>(
  currencies: Rates,
) {
  const BASE_URL = "https://economia.awesomeapi.com.br/last/";

  const currencyList = currencies
    .map((currency) => currency.toUpperCase())
    .filter((currency) => currency !== "BRL")
    .map((currency) => `${currency}-BRL`)
    .join(",");

  const url = new URL(currencyList, BASE_URL);

  return fetch(url)
    .then(async (response) => {
      const json = await response.json();
      if (!response.ok && json?.code === "CoinNotExists") {
        throw new CurrencyNotFoundError(json.message);
      }

      return json;
    })
    .then((currencyData) => {
      const rates = Object.entries(currencyData).map(([currencyName, currencyRate]) => [
        currencyName.replace(/BRL/ig, ""),
        currencySchema.parse(currencyRate).high,
      ]);

      return Object.fromEntries(rates);
    }) as { [k in Rates[number]]: number };
}

export type CurrencyConverstionRates = Awaited<
  ReturnType<typeof getConversionRates>
>;
