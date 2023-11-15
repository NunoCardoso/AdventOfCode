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
  const reindeers: Record<string, Reindeer> = {}

  for await (const line of lineReader) {
    const m = line.match(
      /^(.+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds.$/
    )
    reindeers[m[1]] = {
      name: m[1],
      speed: parseInt(m[2]),
      duration: parseInt(m[3]),
      rest: parseInt(m[4]),
      score: 0,
      distance: 0
    }
  }

  Object.values(reindeers).forEach((reindeer) => {
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
    if (distance > part1) {
      part1 = distance
    }
    log.debug('reindeer', reindeer.name, 'distance', distance)
  })

  if (params.part2?.skip !== true) {
    let time = 0
    const reindeerNames: Array<string> = Object.keys(reindeers)
    let distanceInLead: number = 0
    let reindeerInLead: Array<string> = []
    while (time < timeCutoff) {
      reindeerNames.forEach((name: string) => {
        const moddedTime = time % (reindeers[name].duration + reindeers[name].rest)
        if (moddedTime < reindeers[name].duration) {
          reindeers[name].distance += reindeers[name].speed
          if (reindeers[name].distance > distanceInLead) {
            distanceInLead = reindeers[name].distance
            reindeerInLead = [reindeers[name].name]
          } else if (reindeers[name].distance === distanceInLead) {
            reindeerInLead.push(reindeers[name].name)
          }
        }
      })
      log.debug(time, distanceInLead, reindeerInLead)
      reindeerInLead.forEach((name: string) => {
        reindeers[name].score = reindeers[name].score + 1
      })
      time++
    }

    const rankedReindeers = Object.keys(reindeers).sort((a, b) => reindeers[b].score - reindeers[a].score)
    part2 = reindeers[rankedReindeers[0]].score
  }

  return { part1, part2 }
}
