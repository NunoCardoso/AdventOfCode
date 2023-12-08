import { Params } from 'aoc.d'
import { parseInt } from 'lodash'

// Time, Distance
type Race = { time?: number; distance?: number }
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const races1: Array<Race> = []
  const races2: Array<Race> = []

  for await (const line of lineReader) {
    const values = line.split(/\s+/)
    if (values[0] === 'Time:') {
      values.shift()
      values.forEach((x: string) => races1.push({ time: parseInt(x) }))
      races2.push({ time: parseInt(values.join('')) })
    }
    if (values[0] === 'Distance:') {
      values.shift()
      values.forEach((x: string, i: number) => {
        races1[i].distance = parseInt(x)
      })
      races2[0].distance = parseInt(values.join(''))
    }
  }

  const doRaces = (races: Array<Race>) => {
    return races.map((race) => {
      // distance = speed * time, or (x)(Time - x)
      // in the example where minDistance = 9 and time = 7
      // 9 = (x)(7-x) =>  x*x - 7x + 9 = 0
      // x = (7 +- sqrt(49 - 4*1*9)) / 2*1 = (7 +- 3.6)/2 = 5.3 and 1.7
      // so, races 2, 3, 4 and 5 are the ones with distance > 9

      const firstTimeForWinningDistance =
        (race.time! - Math.sqrt(race.time! * race.time! - 4.0 * race.distance!)) / 2.0
      const secondTimeForWinningDistance =
        (race.time! + Math.sqrt(race.time! * race.time! - 4.0 * race.distance!)) / 2.0
      const firstTime = Math.ceil(firstTimeForWinningDistance + 0.01) // 0.01 to make sure there are no matching distances
      const secondTime = Math.floor(secondTimeForWinningDistance - 0.01) // 0.01 to make sure there are no matching distances
      return 1 + secondTime - firstTime
    })
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doRaces(races1).reduce((a, b) => a * b, 1)
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part2 = doRaces(races2)[0]
  }
  return { part1, part2 }
}
