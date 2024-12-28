import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let data: Array<number> = []

  for await (const line of lineReader) {
    data = line.split(/\s+/g).map(Number)
  }

  let memory: Set<string> = new Set()
  let done = false
  let memoryString = ''

  do {
    let index: number = 0
    let value: number = 0
    data.forEach((n: number, i: number) => {
      if (n > value) {
        value = n
        index = i
      }
    })
    let amount = Math.floor(value / data.length)
    let reminder = value % data.length
    let higherIndex = (index + reminder) % data.length
    memoryString = ''
    for (let i = 0; i < data.length; i++) {
      data[i] += amount
      // spread the reminder
      if ((higherIndex > index && i > index && i <= higherIndex) || (higherIndex < index && (i > index || i <= higherIndex))) {
        data[i]++
      }
      // remove the value from the memory slot
      if (i === index) data[i] -= value
      // build a string from memory config
      memoryString += data[i]
    }
    memory.has(memoryString) ? (done = true) : memory.add(memoryString)
  } while (!done)

  part1 = memory.size + 1
  // spread set into array so I can get the indexOf. Way faster with a set than with an array
  part2 = part1 - ([...memory].indexOf(memoryString) + 1)

  return { part1, part2 }
}
