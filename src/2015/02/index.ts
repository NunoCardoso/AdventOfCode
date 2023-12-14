export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values: Array<number> = line
      .split('x')
      .map(Number)
      .sort((a: number, b: number) => a - b)
    const w: number = values[0] * values[1]
    const h: number = values[0] * values[2]
    const d: number = values[1] * values[2]
    const totalPaper: number = 2 * w + 2 * h + 2 * d + Math.min(w, h, d)
    const totalRibbon: number = 2 * values[0] + 2 * values[1] + values[0] * values[1] * values[2]
    part1 += totalPaper
    part2 += totalRibbon
  }

  return { part1, part2 }
}
