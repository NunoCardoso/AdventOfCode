import { Params } from 'aoc.d'
import { Dimension, Location } from 'declarations'
import { getKey } from 'util/location'

type Rule = [axis: string, amount: number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: string = ''

  const printGrid = (dots: Location[], dimension: Dimension): string[] => {
    let res = []
    for (let y = 0; y < dimension[1]; y++) {
      let line = ''
      for (let x = 0; x < dimension[0]; x++) line += dots.some((dot) => dot[0] === x && dot[1] === y) ? '#' : '.'
      res.push(line + '\n')
    }
    return res
  }

  const dimension: Dimension = [0, 0]
  let dots: Location[] = []
  let dotRecord: Set<string> = new Set<string>()
  const rules: Rule[] = []

  for await (const line of lineReader) {
    if (!line.startsWith('fold') && line.length > 0) {
      const dot = line.split(',').map(Number)
      dots.push(dot)
      dotRecord.add(getKey(dot))
      if (dot[0] > dimension[0]) dimension[0] = dot[0]
      if (dot[1] > dimension[1]) dimension[1] = dot[1]
    }
    if (line.startsWith('fold')) {
      const [, axis, amount] = line.match(/fold along (.)=(\d+)/)
      rules.push([axis, +amount])
    }
  }

  dimension[0]++
  dimension[1]++

  rules.forEach((rule, ruleNumber) => {
    const axisIndex: number = rule[0] === 'x' ? 0 : 1
    const whereToFold = rule[1]
    const sizeOfFoldedSide = dimension[axisIndex] - whereToFold - 1
    // the fold side will be all contained inside the unfolded side
    if (sizeOfFoldedSide <= whereToFold) {
      dimension[axisIndex] = whereToFold // shrink the dimension
      for (let dot of dots) {
        if (dot[axisIndex] > whereToFold) {
          dotRecord.delete(getKey(dot))
          dot[axisIndex] = 2 * whereToFold - dot[axisIndex]
          dotRecord.add(getKey(dot))
        }
      }
    } else {
      // the fold side will overflow the unfolded side
      let biggestNegativeNumber = 0 // the biggest overflowing row
      for (let dot of dots) {
        if (dot[axisIndex] > sizeOfFoldedSide) {
          dotRecord.delete(getKey(dot))
          dot[axisIndex] = 2 * sizeOfFoldedSide - dot[axisIndex]
          dotRecord.add(getKey(dot))
          if (dot[axisIndex] < biggestNegativeNumber) biggestNegativeNumber = dot[axisIndex]
        }
      }
      if (biggestNegativeNumber < 0) {
        for (let dot of dots) {
          dotRecord.delete(getKey(dot))
          dot[axisIndex] += Math.abs(biggestNegativeNumber)
          dotRecord.add(getKey(dot))
        }
      }
      dimension[axisIndex] = dimension[axisIndex] - whereToFold + Math.abs(biggestNegativeNumber)
    }

    dots = [...dotRecord]
      .map((x) => x.split(',').map(Number) as Location)
      .filter((dot) => dot[axisIndex] !== whereToFold)
    if (ruleNumber === 0) part1 = dots.length
  })

  part2 = printGrid(dots, dimension).join('')

  return { part1, part2 }
}
