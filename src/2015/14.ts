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
  const finishTime = params.seconds
  const reindeerPart1: Reindeer[] = [],
    reindeerPart2: Reindeer[] = []
  let time = 0
  let distanceInLead: number = 0
  let reindeerInLead: Reindeer[] = [] // can be more than one in the lead at same time

  for await (const line of lineReader) {
    const [, name, speed, duration, rest] = line.match(
      /^(.+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds.$/
    )
    let reindeer = {
      name,
      speed: +speed,
      duration: +duration,
      rest: +rest,
      score: 0,
      distance: 0
    }
    reindeerPart1.push({ ...reindeer })
    reindeerPart2.push({ ...reindeer })
  }

  reindeerPart1.forEach((reindeer) => {
    let time = 0
    let mode = 'running'
    while (time < finishTime) {
      let timeBit: number
      if (mode === 'running') {
        timeBit = Math.min(reindeer.duration, finishTime - time)
        reindeer.distance += reindeer.speed * timeBit
        mode = 'resting'
      } else {
        timeBit = Math.min(reindeer.rest, finishTime - time)
        mode = 'running'
      }
      time += timeBit
    }
    if (reindeer.distance > part1) part1 = reindeer.distance
    log.debug('reindeer', reindeer.name, 'distance', reindeer.distance)
  })

  while (time < finishTime) {
    reindeerPart2.forEach((reindeer) => {
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
  part2 = reindeerPart2.sort((a, b) => b.score - a.score)[0].score

  return { part1, part2 }
}
