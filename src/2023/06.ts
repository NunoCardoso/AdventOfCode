import { Params } from 'aoc.d'

// Time, Distance
type Race = [number?, number?]

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const doRaces = (races: Race[]) =>
    races.map((race) => {
      const firstTimeForWinningDistance = (race[0]! - Math.sqrt(race[0]! * race[0]! - 4.0 * race[1]!)) / 2.0
      const secondTimeForWinningDistance = (race[0]! + Math.sqrt(race[0]! * race[0]! - 4.0 * race[1]!)) / 2.0
      const firstTime = Math.ceil(firstTimeForWinningDistance + 0.01) // making sure there are no matching distances
      const secondTime = Math.floor(secondTimeForWinningDistance - 0.01) // making sure there are no matching distances
      return 1 + secondTime - firstTime // 1 is to include the range
    })

  let races1: Race[], races2: Race[]

  for await (const line of lineReader) {
    const values = line.match(/\d+/g)
    if (line.startsWith('Time:')) {
      races1 = values.map((val: string) => [+val, undefined])
      races2 = [[+values.join(''), undefined]]
    }
    if (line.startsWith('Distance:')) {
      values.forEach((value: string, index: number) => (races1[index][1] = +value))
      races2![0][1] = +values.join('')
    }
  }

  if (!params.skipPart1) part1 = doRaces(races1!).reduce((a, b) => a * b, 1)
  if (!params.skipPart2) part2 = doRaces(races2!)[0]

  return { part1, part2 }
}
