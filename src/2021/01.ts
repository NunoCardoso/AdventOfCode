export default async (lineReader: any) => {
  const data: Array<number> = []

  for await (const line of lineReader) data.push(+line)

  const solveFor = (amount: number) =>
    data.reduce((acc, val, index) => {
      if (index >= amount) {
        const val = data.slice(index - amount, index).reduce((x, y) => x + y, 0)
        const previousVal = data.slice(index - 1 - amount, index - 1).reduce((x, y) => x + y, 0)
        if (val > previousVal) return ++acc
      }
      return acc
    }, 0)

  return {
    part1: solveFor(1),
    part2: solveFor(3)
  }
}
