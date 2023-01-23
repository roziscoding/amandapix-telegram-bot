import { evaluate, round } from "https://esm.sh/mathjs@11.5.0";

export function evaluateQuery(query: string): Promise<number | null> {
  try {
    return round(evaluate(query.replace(/,/g, ".")), 2);
  } catch {
    return Promise.resolve(null);
  }
}
