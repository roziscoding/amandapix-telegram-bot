import { evaluate, round } from "mathjs";
import { CurrencyConverstionRates, getConversionRates } from "./currency.ts";

export async function evaluateQuery(
  query: string,
): Promise<
  {
    readonly finalValue: number;
    readonly hasConversion: boolean;
    readonly rates: Record<string, number>;
    readonly values: {
      currency: string;
      value: number;
      converted: number;
    }[];
    readonly finalQuery: string;
  }
> {
  const values = extractCurrencies(query);

  if (!values.length) {
    const amount = round(evaluate(query), 2);
    return {
      finalValue: amount,
      hasConversion: false,
      rates: {},
      values: [{ converted: amount, currency: "BRL", value: amount }],
      finalQuery: query,
    };
  }

  const rates = await getConversionRates(
    values.map(({ currency }) => currency),
  );
  const convertedValues = convertValues(values, rates);

  const convertedQuery = buildConvertedQuery(query, convertedValues);

  return {
    finalValue: round(evaluate(convertedQuery), 2),
    hasConversion: Object.keys(rates).length > 0,
    rates,
    values: convertedValues,
    finalQuery: convertedQuery,
  } as const;
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
