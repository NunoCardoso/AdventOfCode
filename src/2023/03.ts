import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Location, LocationPlus } from 'declarations'
import { getKey } from 'util/location'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const symbols: Map<string, string> = new Map()
  const gearToParts: Map<string, LocationPlus[]> = new Map()
  const parts: LocationPlus[] = []

  // for printGrid only
  const partIndex: Record<string, string> = {}
  const gearIndex: Record<string, string> = {}

  const printGrid = (lines: string[]) => {
    lines.forEach((line: string, rowIndex: number) => {
      let l = ''
      for (let colIndex = 0; colIndex < line.length; colIndex++) {
        if (gearIndex[rowIndex + ',' + colIndex]) {
          l += clc.green(gearIndex[rowIndex + ',' + colIndex])
          colIndex += gearIndex[rowIndex + ',' + colIndex].length - 1
        } else if (partIndex[rowIndex + ',' + colIndex]) {
          l += clc.red(partIndex[rowIndex + ',' + colIndex])
          colIndex += partIndex[rowIndex + ',' + colIndex].length - 1
        } else {
          l += line[colIndex]
        }
      }
      log.info(l)
    })
  }

  let rowIndex = 0
  const lines: string[] = []
  for await (const line of lineReader) {
    ;[...line.matchAll(/\d+/g)].forEach((match) => parts.push([rowIndex, match.index, +match[0]]))
    ;[...line.matchAll(/[^\d.]/g)].forEach((match) => symbols.set(rowIndex + ',' + match.index, match[0]))
    lines.push(line)
    rowIndex++
  }

  parts.forEach((part) => {
    // get dimensions for the part number string
    const partDimensions: [Location, Location] = [part.slice(0, 2) as Location, part.slice(0, 2) as Location]
    partDimensions[1][1] += part[2].toString().length - 1
    for (let row = partDimensions[0][0] - 1; row <= partDimensions[1][0] + 1; row++) {
      for (let col = partDimensions[0][1] - 1; col <= partDimensions[1][1] + 1; col++) {
        const key = getKey([row, col])
        if (symbols.has(key)) {
          part1 += part[2]
          if (symbols.get(key) === '*') {
            if (!gearToParts.has(key)) gearToParts.set(key, [part])
            else gearToParts.get(key)!.push(part)
          }
          partIndex[getKey(part)] = part[2].toString()
        }
      }
    }
  })
  ;[...gearToParts.keys()]
    .filter((key) => (gearToParts.get(key) ?? []).length === 2)
    .map((key) => {
      const parts: LocationPlus[] = gearToParts.get(key) ?? []
      gearIndex[getKey(parts[0])] = parts[0][2].toString()
      gearIndex[getKey(parts[1])] = parts[1][2].toString()
      return parts
    })
    .forEach((parts) => (part2 += parts[0][2] * parts[1][2]))

  if (params.ui.show) printGrid(lines)

  return { part1, part2 }
}
