import { Params } from 'aoc.d'
import * as console from 'console'
import { range } from 'util/range'

type Event = {
  date: Date
  action: 'wakes' | 'falls'
  guard: number | null
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const getSleepingMinutesInMidnightHour = (start: Date, end: Date): number[] => {
    if (start.getHours() !== 0) {
      start.setDate(start.getDate() + 1)
      start.setHours(0)
      start.setMinutes(0)
    }
    if (start < end) {
      let endMinutes = end.getHours() === 0 ? end.getMinutes() : 60
      let minuteRange = endMinutes - start.getMinutes()
      return range(minuteRange, start.getMinutes())
    }
    return []
  }

  let currentGuard: number
  let startingSleepDate: Date
  let endingSleepDate: Date

  let logEvents: Event[] = []
  let totalMinutesPerGuard: Record<number, number> = {}
  let topMinutesPerGuard: Record<number, Record<number, number>> = {}

  for await (const line of lineReader) {
    const [, date, action, action2] = line.match(/\[(.+)] (.+?) (.+)/)
    const guard = action2.startsWith('#') ? +action2.match(/#(\d+).*/)[1] : null
    logEvents.push({ date: new Date(date), action, guard })
  }

  logEvents
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .forEach((event) => {
      if (event.guard !== null) currentGuard = event.guard
      if (event.action === 'falls') startingSleepDate = event.date
      if (event.action === 'wakes') {
        endingSleepDate = event.date
        let minutes = getSleepingMinutesInMidnightHour(startingSleepDate, endingSleepDate)
        totalMinutesPerGuard[currentGuard] = (totalMinutesPerGuard[currentGuard] ?? 0) + minutes.length
        minutes.forEach((minute) => {
          if (!topMinutesPerGuard[currentGuard]) topMinutesPerGuard[currentGuard] = {}
          topMinutesPerGuard[currentGuard][minute] = (topMinutesPerGuard[currentGuard][minute] ?? 0) + 1
        })
      }
    })
  // sort descending
  const sortedMinutesPerGuard = Object.keys(totalMinutesPerGuard).sort(
    (a, b) => totalMinutesPerGuard[+b] - totalMinutesPerGuard[+a]
  )
  const topGuard = +sortedMinutesPerGuard[0]

  const sortedTopMinutes = Object.keys(topMinutesPerGuard[topGuard]).sort(
    (a, b) => topMinutesPerGuard[topGuard][+b] - topMinutesPerGuard[topGuard][+a]
  )
  const topMinute = +sortedTopMinutes[0]

  log.debug(totalMinutesPerGuard, topMinutesPerGuard)
  part1 = topGuard * topMinute

  let part2aux = 0
  // let's combine guard and minute as a key for a simple array sort
  Object.keys(topMinutesPerGuard).forEach((key1) => {
    Object.keys(topMinutesPerGuard[+key1]).forEach((key2) => {
      if (topMinutesPerGuard[+key1][+key2] > part2aux) {
        part2aux = topMinutesPerGuard[+key1][+key2]
        part2 = +key1 * +key2
      }
    })
  })

  return { part1, part2 }
}
