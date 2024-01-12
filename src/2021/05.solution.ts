import { Params } from 'aoc.d'

export default async (lineReader: any) => {
  const dataPart1: Record<string, number> = {}
  const dataPart2: Record<string, number> = {}

  const increment = (data: Record<string, number>, key: string) =>
    data[key] !== undefined ? data[key]++ : (data[key] = 1)

  for await (const line of lineReader) {
    const [X1, Y1, X2, Y2] = line.match(/\d+/g).map(Number)
    const diffX = X2 - X1
    const diffY = Y2 - Y1
    const maxDiff = Math.max(Math.abs(diffX), Math.abs(diffY))
    if (diffX === 0 || diffY === 0 || Math.abs(diffX) === Math.abs(diffY)) {
      for (let tick = 0; tick <= maxDiff; tick++) {
        const X = X1 === X2 ? X1 : X1 > X2 ? X1 - tick : X1 + tick
        const Y = Y1 === Y2 ? Y1 : Y1 > Y2 ? Y1 - tick : Y1 + tick
        const key = `${X}-${Y}`
        if (diffX === 0 || diffY === 0) increment(dataPart1, key)
        increment(dataPart2, key)
      }
    }
  }

  return {
    part1: Object.values(dataPart1).filter((val) => val >= 2).length,
    part2: Object.values(dataPart2).filter((val) => val >= 2).length
  }
}
