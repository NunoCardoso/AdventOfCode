export default async (lineReader: any) => {
  const data: number[] = []
  for await (const line of lineReader) data.push(+line)

  const solveFor = (amount: number) => {
    let previousValue = Number.NaN
    return data.reduce((acc, val, index) => {
      let res = acc
      if (index >= amount - 1) {
        const val = data.slice(index - amount, index).reduce((x, y) => x + y, 0)
        if (previousValue !== Number.NaN && val > previousValue) res = res + 1
        previousValue = val
        return res
      }
      return acc
    }, 0)
  }

  return {
    part1: solveFor(1),
    part2: solveFor(3)
  }
}
