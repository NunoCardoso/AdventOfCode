export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values: Array<number> = line
      .match(/\d+/g)
      .map(Number)
      .sort((a: number, b: number) => a - b)
    const w: number = values[0] * values[1]
    const h: number = values[0] * values[2]
    const d: number = values[1] * values[2]
    part1 += 2 * w + 2 * h + 2 * d + Math.min(w, h, d)
    part2 += 2 * values[0] + 2 * values[1] + values[0] * values[1] * values[2]
  }

  return { part1, part2 }
}
