import { evaluate, round } from "npm:mathjs";

export function evaluateQuery(query: string): Promise<number | null> {
  try {
    return round(evaluate(query.replace(/,/g, ".")), 2);
  } catch {
    return Promise.resolve(null);
  }
}
