import { Params } from 'aoc.d'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const part1: number = 0
  const part2: number = 0

  const data: Array<any> = []
  const indexOfObjects: Array<string> = ['E']
  for await (const line of lineReader) {
    const objects: Array<string> = []
    const m = line.match(/The (.+) floor contains (.*)./)
    const index = ['first', 'second', 'third', 'fourth'].indexOf(m[1])
    if (index === 0) {
      objects.push('E')
    }
    const bits = m[2].split(/(, |and )/)
    for (let i = 0; i < bits.length; i++) {
      if (bits[i].trim().startsWith('a ')) {
        let m2 = bits[i].match(/a (.+)-compatible microchip/)
        if (m2?.length > 0) {
          const object = m2[1][0].toUpperCase() + 'M'
          objects.push(object)
          indexOfObjects.push(object)
        } else {
          m2 = bits[i].match(/a (.+) generator/)
          if (m2?.length > 0) {
            const object = m2[1][0].toUpperCase() + 'G'
            objects.push(object)
            indexOfObjects.push(object)
          }
        }
      }
    }
    data[index] = objects
  }

  const print = () => {
    for (let i = data.length - 1; i >= 0; i--) {
      console.log(
        clc.yellow('F' + (i + 1)) +
          ' ' +
          indexOfObjects
            .map((o) => {
              if (data[i].indexOf(o) >= 0) {
                return o
              } else {
                return '. '
              }
            })
            .join(' ')
      )
    }
  }

  print()
  return { part1, part2 }
}
