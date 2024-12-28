import * as console from 'console'
import { Params } from 'aoc.d'

type Event = {
  date: Date
  action: 'wakes' | 'falls'
  guard: number | null
}

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let logEvents: Event[] = []
  let totalMinutesPerGuard: Record<number, number> = {}
  let topMinutesPerGuard: Record<number, Record<number, number>> = {}
  let topInstancesPerGuard: Record<string, number> = {}
  for await (const line of lineReader) {
    const [, date, action, action2] = line.match(/\[(.+)] (.+?) (.+)/)
    const guard = action2.startsWith('#') ? +action2.match(/#(\d+).*/)[1] : null
    logEvents.push({ date: new Date(date), action, guard })
  }

  logEvents.sort((a, b) => a.date.getTime() - b.date.getTime())

  const getSleepingMinutesInMidnightHour = (start: Date, end: Date): number[] => {
    const minutes = []
    if (start.getHours() !== 0) {
      start.setDate(start.getDate() + 1)
      start.setHours(0)
      start.setMinutes(0)
    }
    if (start < end) {
      let endMinutes = end.getHours() === 0 ? end.getMinutes() : 60
      for (var x = start.getMinutes(); x < endMinutes; x++) {
        minutes.push(x)
      }
    }
    return minutes
  }

  const solveFor = () => {
    let currentGuard: number
    let startingSleepDate: Date
    let endingSleepDate: Date
    logEvents.forEach((event) => {
      if (event.guard !== null) {
        currentGuard = event.guard
      }
      if (event.action === 'falls') {
        startingSleepDate = event.date
      }
      if (event.action === 'wakes') {
        endingSleepDate = event.date

        let minutes = getSleepingMinutesInMidnightHour(startingSleepDate, endingSleepDate)

        if (!totalMinutesPerGuard[currentGuard]) totalMinutesPerGuard[currentGuard] = 0
        totalMinutesPerGuard[currentGuard] += minutes.length

        minutes.forEach((minute) => {
          if (!topMinutesPerGuard[currentGuard]) topMinutesPerGuard[currentGuard] = {}
          if (!topMinutesPerGuard[currentGuard][minute]) topMinutesPerGuard[currentGuard][minute] = 0
          topMinutesPerGuard[currentGuard][minute]++
        })
      }
    })
  }

  solveFor()

  // sort descending
  const sortedMinutesPerGuard = Object.keys(totalMinutesPerGuard).sort((a, b) => totalMinutesPerGuard[+b] - totalMinutesPerGuard[+a])
  const topGuard = +sortedMinutesPerGuard[0]

  const sortedTopMinutes = Object.keys(topMinutesPerGuard[topGuard]).sort((a, b) => topMinutesPerGuard[topGuard][+b] - topMinutesPerGuard[topGuard][+a])
  const topMinute = +sortedTopMinutes[0]

  console.log(totalMinutesPerGuard, topMinutesPerGuard)
  part1 = topGuard * topMinute

  // let's combine guard and minute as a key for a simple array sort
  Object.keys(topMinutesPerGuard).forEach((key1) => {
    Object.keys(topMinutesPerGuard[+key1]).forEach((key2) => {
      topInstancesPerGuard[key1 + ':' + key2] = topMinutesPerGuard[+key1][+key2]
    })
  })

  const highestMinuteAndGuard = Object.keys(topInstancesPerGuard).sort((a, b) => topInstancesPerGuard[b] - topInstancesPerGuard[a])

  let part2values = highestMinuteAndGuard[0].split(':').map(Number)
  part2 = part2values[0] * part2values[1]

  return { part1, part2 }
}
