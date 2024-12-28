export default async (lineReader: any) => {
  let part1: number = 0
  let part2: number = 0

  for await (const line of lineReader) {
    const values: Array<number> = line
      .match(/\d+/g)
      .map(Number)
      .sort((a: number, b: number) => (a - b > 0 ? 1 : -1))
    part1 += values[values.length - 1] - values[0]

    for (let i = 0; i < values.length - 1; i++) {
      for (let j = i + 1; j < values.length; j++) {
        if (values[j] % values[i] === 0) {
          part2 += values[j] / values[i]
          break
        }
      }
    }
  }

  return { part1, part2 }
}
