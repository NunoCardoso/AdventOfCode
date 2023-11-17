import { Params } from 'aoc.d'
import clc from 'cli-color'
import { Dimension, Point } from 'declarations'
import _, { parseInt } from 'lodash'

type Rule = [string, number]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  const part2: number = 0

  const dimension: Dimension = [0, 0]
  let dots: Array<Point> = []
  const rules: Array<Rule> = []

  const printGrid = (dots: Array<Point>) => {
    for (let y = 0; y < dimension[1]; y++) {
      let line = clc.blue(y.toString().padStart(3, '0')) + ' '
      for (let x = 0; x < dimension[0]; x++) {
        if (_.find(dots, (dot) => dot[0] === x && dot[1] === y)) {
          line += clc.red('#')
        } else {
          line += '.'
        }
      }
      console.log(line)
    }
    console.log('\n')
  }

  for await (const line of lineReader) {
    if (!line.startsWith('fold') && line.length > 0) {
      const dot = line.split(',').map((s: string) => parseInt(s))
      dots.push(dot)
      if (dot[0] > dimension[0]) {
        dimension[0] = dot[0]
      }
      if (dot[1] > dimension[1]) {
        dimension[1] = dot[1]
      }
    }
    if (line.startsWith('fold')) {
      const m = line.match(/fold along (.)=(\d+)/)
      rules.push([m[1], parseInt(m[2])])
    }
  }

  dimension[0]++
  dimension[1]++

  log.info('world of dimension', dimension)

  rules.forEach((rule, ruleNumber) => {
    const index: number = rule[0] === 'x' ? 0 : 1
    const fold = rule[1]
    const topPart = fold
    const bottomPart = dimension[index] - fold - 1
    if (bottomPart <= topPart) {
      for (let i = 0; i < dots.length; i++) {
        if (dots[i][index] > topPart) {
          const _diff = dots[i][index] - topPart
          dots[i][index] = topPart - _diff
        }
      }
      dimension[index] = topPart
    } else {
      let biggestNegativeNumber = 0
      for (let i = 0; i < dots.length; i++) {
        if (dots[i][index] > bottomPart) {
          const _diff = dots[i][index] - bottomPart
          dots[i][index] = bottomPart - _diff
          if (dots[i][index] < biggestNegativeNumber) {
            biggestNegativeNumber = dots[i][index]
          }
        }
      }
      if (biggestNegativeNumber < 0) {
        for (let i = 0; i < dots.length; i++) {
          dots[i][index] += Math.abs(biggestNegativeNumber)
        }
      }
      dimension[index] = dimension[index] - fold + Math.abs(biggestNegativeNumber)
    }
    dots = _.uniqWith(dots, _.isEqual).filter((dot) => dot[index] !== fold)
    if (ruleNumber === 0) {
      part1 = dots.length
    }
  })

  printGrid(dots)

  return { part1, part2 }
}
