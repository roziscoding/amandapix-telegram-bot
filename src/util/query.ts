import * as math from "https://esm.sh/mathjs@11.4.0";

export function evaluateQuery(query: string): Promise<number | null> {
  try {
    return math.round(math.evaluate(query.replace(/,/g, ".")), 2);
  } catch {
    return Promise.resolve(null);
  }
}
