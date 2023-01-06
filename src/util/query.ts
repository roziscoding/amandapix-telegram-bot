import { evaluate, round } from "mathjs";

export function evaluateQuery(query: string): Promise<number | null> {
  try {
    return round(evaluate(query.replace(/,/g, ".")), 2);
  } catch {
    return Promise.resolve(null);
  }
}
