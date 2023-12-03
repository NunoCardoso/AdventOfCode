import { Params } from 'aoc.d'
import clc from 'cli-color'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const numbers: Array<any> = []
  const partIndex: Record<string, string> = {}
  const symbols: Record<string, string> = {}
  const gears: Record<string, Array<number>> = {}

  let it = 0
  const lines: Array<string> = []

  const printGrid = () => {
    lines.forEach((line: string, i: number) => {
      let l = ''
      for (let j = 0; j < line.length; j++) {
        if (partIndex[i + '-' + j]) {
          l += clc.red(partIndex[i + '-' + j])
          j += partIndex[i + '-' + j].length - 1
        } else {
          l += line[j]
        }
      }
      console.log(l)
    })
  }

  for await (const line of lineReader) {
    lines.push(line)
    ;[...line.matchAll(/\d+/g)].forEach((x: any) => {
      numbers.push({
        number: parseInt(x[0]),
        position: [it, x.index]
      })
    })
    ;[...line.matchAll(/[^\d.]/g)].forEach((x: any) => {
      const key = it + '-' + x.index
      symbols[key] = x[0]
    })
    it++
  }

  for (let x = 0; x < numbers.length; x++) {
    // the box for the number
    const firstCoord = numbers[x].position.slice()
    const lastCoord = numbers[x].position.slice()
    lastCoord[1] += numbers[x].number.toString().length - 1
    for (let row = firstCoord[0] - 1; row <= lastCoord[0] + 1; row++) {
      for (let col = firstCoord[1] - 1; col <= lastCoord[1] + 1; col++) {
        const _key = row + '-' + col
        if (symbols[_key]) {
          part1 += numbers[x].number
          if (symbols[_key] === '*') {
            if (!gears[_key]) {
              gears[_key] = []
            }
            gears[_key].push(numbers[x].number)
          }
          partIndex[numbers[x].position[0] + '-' + numbers[x].position[1]] = numbers[x].number.toString()
        }
      }
    }
  }

  Object.keys(gears).forEach((key) => {
    const numbers: Array<number> = gears[key]
    if (numbers.length === 2) {
      part2 += numbers[0] * numbers[1]
    }
  })

  if (params.ui.show) {
    printGrid()
  }

  return { part1, part2 }
}
