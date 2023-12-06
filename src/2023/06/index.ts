import { Params } from 'aoc.d'
import { parseInt } from 'lodash'

type Race = [number, number]
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const races1: Array<Race> = []
  const races2: Array<Race> = []

  for await (const line of lineReader) {
    const values = line.split(/\s+/)
    if (values[0] === 'Time:') {
      values.shift()
      values.forEach((x: string) => races1.push([parseInt(x), 0] as Race))
      races2.push([parseInt(values.join('')), 0] as Race)
    }
    if (values[0] === 'Distance:') {
      values.shift()
      values.forEach((x: string, i: number) => {
        races1[i][1] = parseInt(x)
      })
      races2[0][1] = parseInt(values.join(''))
    }
  }

  const doRaces = (races: Array<Race>) => {
    const numberOfSuccessRaces: Array<number> = Array(races.length).fill(0)
    for (let i = 0; i < races.length; i++) {
      for (let j = 0; j <= races[i][0]; j++) {
        const wait = j
        const going = races[i][0] - j
        const distance = wait * going
        log.debug('race', i, 'waiting', wait, 'going', going, 'distance', distance)
        if (distance > races[i][1]) {
          numberOfSuccessRaces[i]++
        }
      }
    }
    return numberOfSuccessRaces
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part1 = doRaces(races1).reduce((a, b) => a * b, 1)
  }

  if (params.skip !== true && params.skip !== 'part1') {
    part2 = doRaces(races2)[0]
  }
  return { part1, part2 }
}
