import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Point } from 'declarations'

type Part = {
  number: number
  position: Point
}
export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const symbols: Map<string, string> = new Map()
  const gearToParts: Map<string, Array<Part>> = new Map()
  const parts: Array<Part> = []

  // for printGrid only
  const partIndex: Record<string, string> = {}
  const gearIndex: Record<string, string> = {}

  let it = 0
  const lines: Array<string> = []

  const printGrid = () => {
    lines.forEach((line: string, i: number) => {
      let l = ''
      for (let j = 0; j < line.length; j++) {
        if (gearIndex[i + '-' + j]) {
          l += clc.green(gearIndex[i + '-' + j])
          j += gearIndex[i + '-' + j].length - 1
        } else if (partIndex[i + '-' + j]) {
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
    ;[...line.matchAll(/\d+/g)].forEach((match) => {
      parts.push({
        number: +match[0],
        position: [it, match.index]
      })
    })
    ;[...line.matchAll(/[^\d.]/g)].forEach((match) => symbols.set(it + '-' + match.index, match[0]))
    it++
  }

  if (!params.skipPart1) {
    parts.forEach((part) => {
      // get dimensions for the part number string
      const partDimensions: [Point, Point] = [part.position.slice() as Point, part.position.slice() as Point]
      partDimensions[1][1] += part.number.toString().length - 1
      for (let row = partDimensions[0][0] - 1; row <= partDimensions[1][0] + 1; row++) {
        for (let col = partDimensions[0][1] - 1; col <= partDimensions[1][1] + 1; col++) {
          const key = row + '-' + col
          if (symbols.has(key)) {
            part1 += part.number
            if (symbols.get(key) === '*') {
              if (!gearToParts.has(key)) gearToParts.set(key, [part])
              else gearToParts.get(key)!.push(part)
            }
            partIndex[part.position[0] + '-' + part.position[1]] = part.number.toString()
          }
        }
      }
    })
  }

  if (!params.skipPart2) {
    Array.from(gearToParts.keys())
      .filter((key) => (gearToParts.get(key) ?? []).length === 2)
      .map((key) => {
        const parts: Array<Part> = gearToParts.get(key) ?? []
        gearIndex[parts[0].position[0] + '-' + parts[0].position[1]] = parts[0].number.toString()
        gearIndex[parts[1].position[0] + '-' + parts[1].position[1]] = parts[1].number.toString()
        return parts
      })
      .forEach((parts) => {
        part2 += parts[0]!.number * parts[1]!.number
      })
  }

  if (params.ui.show) {
    printGrid()
  }

  return { part1, part2 }
}
