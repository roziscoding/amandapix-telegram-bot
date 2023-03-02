import { evaluate, round } from "https://esm.sh/mathjs@11.5.0";
import { CurrencyConverstionRates, getConversionRates } from "./currency.ts";

export function evaluateQuery(query: string): Promise<number | null> {
  try {
    return round(evaluate(query.replace(/,/g, ".")), 2);
  } catch {
    return Promise.resolve(null);
  }
}

export async function evaluateConversionQuery(
  query: string,
) {
  try {
    const values = extractCurrencies(query);
    const rates = await getConversionRates(
      values.map(({ currency }) => currency),
    );
    const convertedValues = convertValues(values, rates);

    const convertedQuery = buildConvertedQuery(query, convertedValues);

    return {
      ok: true,
      finalValue: round(evaluate(convertedQuery), 2),
      rates,
      values: convertedValues,
      finalQuery: convertedQuery,
    } as const;
  } catch (error) {
    return {
      ok: false,
      error,
    } as const;
  }
}

export function extractCurrencies(query: string) {
  const currencyRegex = /(?<value>[0-9,.]+) (?<currency>[a-z]{3})/gi;

  return Array.from(query.matchAll(currencyRegex))
    .map((match) => ({ ...match.groups }))
    .filter(Boolean)
    .filter(({ value, currency }) => value && currency)
    .map(({ value, currency }) => ({
      value: Number(value),
      currency: currency,
    }));
}

export function convertValues(
  values: Array<{ value: number; currency: string }>,
  rates: CurrencyConverstionRates,
) {
  return values.map(({ value, currency }) => ({
    currency,
    value,
    converted: (rates[currency] ?? 1) * value,
  }));
}

export function buildConvertedQuery(
  originalQuery: string,
  convertedValues: Array<
    { currency: string; value: number; converted: number }
  >,
) {
  return convertedValues.reduce(
    (query, conversion) =>
      query.replace(
        `${conversion.value} ${conversion.currency}`,
        conversion.converted.toString(),
      ),
    originalQuery.replace(/,/g, "."),
  );
}
