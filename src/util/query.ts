import { debug, evaluate, round } from "../deps.ts";
import { CurrencyConverstionRates, getConversionRates } from "./currency.ts";

const log = debug("query.ts");

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
    readonly originalQuery: string;
  }
> {
  log("evaluateQuery", query);
  const replacedQuery = query.replace(/\,/ig, ".");
  log("extracting currencies");
  const values = extractCurrencies(replacedQuery);
  log("extracted currencies", values);

  if (!values.length) {
    log("no currencies found");
    const amount = round(evaluate(replacedQuery), 2);
    log("amount", amount);
    return {
      finalValue: amount,
      hasConversion: false,
      rates: {},
      values: [{ converted: amount, currency: "BRL", value: amount }],
      finalQuery: replacedQuery,
      originalQuery: replacedQuery,
    };
  }

  log("getting conversion rates");
  const rates = await getConversionRates(
    values.map(({ currency }) => currency),
  );
  log("conversion rates", rates);
  const convertedValues = convertValues(values, rates);
  log("converted values", convertedValues);

  const convertedQuery = buildConvertedQuery(replacedQuery, convertedValues);
  log("converted query", convertedQuery);

  const finalResult = {
    finalValue: round(evaluate(convertedQuery), 2),
    hasConversion: Object.keys(rates).length > 0,
    rates,
    values: convertedValues,
    finalQuery: convertedQuery,
    originalQuery: replacedQuery,
  } as const;

  log("final result", finalResult);
  return finalResult;
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
