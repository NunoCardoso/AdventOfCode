import { Params } from 'aoc.d'

// Time, Distance
type Race = [number?, number?]
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let races1: Array<Race>, races2: Array<Race>

  for await (const line of lineReader) {
    const values = line.match(/\d+/g)
    if (line.startsWith('Time:')) {
      races1 = values.map((val: string) => [+val, undefined])
      races2 = [[+values.join(''), undefined]]
    }
    if (line.startsWith('Distance:')) {
      values.forEach((val: string, i: number) => (races1[i][1] = +val))
      races2![0][1] = +values.join('')
    }
  }

  const doRaces = (races: Array<Race>) => {
    return races.map((race) => {
      // distance = speed * time, or (x)(Time - x)
      // in the example where minDistance = 9 and time = 7
      // 9 = (x)(7-x) =>  x*x - 7x + 9 = 0
      // x = (7 +- sqrt(49 - 4*1*9)) / 2*1 = (7 +- 3.6)/2 = 5.3 and 1.7
      // so, races 2, 3, 4 and 5 are the ones with distance > 9
      const firstTimeForWinningDistance = (race[0]! - Math.sqrt(race[0]! * race[0]! - 4.0 * race[1]!)) / 2.0
      const secondTimeForWinningDistance = (race[0]! + Math.sqrt(race[0]! * race[0]! - 4.0 * race[1]!)) / 2.0
      const firstTime = Math.ceil(firstTimeForWinningDistance + 0.01) // 0.01 to make sure there are no matching distances
      const secondTime = Math.floor(secondTimeForWinningDistance - 0.01) // 0.01 to make sure there are no matching distances
      return 1 + secondTime - firstTime
    })
  }

  if (!params.skipPart1) {
    part1 = doRaces(races1!).reduce((a, b) => a * b, 1)
  }

  if (!params.skipPart2) {
    part2 = doRaces(races2!)[0]
  }
  return { part1, part2 }
}
