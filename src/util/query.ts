import * as math from 'mathjs'

export async function evaluateQuery(query: string): Promise<number> {
  return math.round(math.evaluate(query.replace(/,/g, '.')), 2)
}
