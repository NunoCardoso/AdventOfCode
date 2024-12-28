import { Params } from 'aoc.d'

type Reindeer = {
  name: string
  speed: number
  duration: number
  rest: number
  score: number
  distance: number
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0
  const timeCutoff = params.cutoff
  const reindeers: Array<Reindeer> = []

  for await (const line of lineReader) {
    const [, name, speed, duration, rest] = line.match(/^(.+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds.$/)
    reindeers.push({
      name,
      speed: +speed,
      duration: +duration,
      rest: +rest,
      score: 0,
      distance: 0
    })
  }

  if (!params.skipPart1) {
    reindeers.forEach((reindeer) => {
      let time = 0
      let distance = 0
      let mode = 'running'
      while (time < timeCutoff) {
        let amount: number
        if (mode === 'running') {
          amount = Math.min(reindeer.duration, timeCutoff - time)
          distance += reindeer.speed * amount
          mode = 'resting'
        } else {
          amount = Math.min(reindeer.rest, timeCutoff - time)
          mode = 'running'
        }
        time += amount
      }
      if (distance > part1) part1 = distance
      log.debug('reindeer', reindeer.name, 'distance', distance)
    })
  }

  if (!params.skipPart2) {
    let time = 0
    let distanceInLead: number = 0
    let reindeerInLead: Array<Reindeer> = [] // can be more than one in the lead at same time
    while (time < timeCutoff) {
      reindeers.forEach((reindeer, i) => {
        const moddedTime = time % (reindeer.duration + reindeer.rest)
        if (moddedTime < reindeer.duration) {
          reindeer.distance += reindeer.speed
          if (reindeer.distance > distanceInLead) {
            distanceInLead = reindeer.distance
            reindeerInLead = [reindeer]
          } else if (reindeer.distance === distanceInLead) {
            reindeerInLead.push(reindeer)
          }
        }
      })
      log.debug(time, distanceInLead, reindeerInLead)
      reindeerInLead.forEach((reindeer: Reindeer) => reindeer.score++)
      time++
    }
    part2 = reindeers.sort((a, b) => b.score - a.score)[0].score
  }

  return { part1, part2 }
}
