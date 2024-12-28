import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  // const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let orderingRules: [number, number][] = []
  let pageUpdates: number[][] = []
  for await (const line of lineReader) {
    if (line.indexOf('|') > 0) orderingRules.push(line.split('|').map(Number))
    if (line.indexOf(',') > 0) pageUpdates.push(line.split(',').map(Number))
  }

  const fixUpdate = (update: number[]): number[] =>
    update.sort((a, b) => {
      let rule = orderingRules.find(
        (rule) => (rule[0] === a && rule[1] === b) || (rule[1] === a && rule[0] === b)
      )
      if (!!rule && a === rule[0]) return -1
      if (!!rule && a === rule[1]) return 1
      return 0
    })

  const solveFor = (part: string): number => {
    let count = 0
    pageUpdates.forEach((update, updateIndex) => {
      let isOrderOK = true
      update.forEach((page, pageIndex) => {
        let leftRules = orderingRules.filter((rule) => rule[0] === page)
        let rightRules = orderingRules.filter((rule) => rule[1] === page)
        if (leftRules.some((rule) => update.indexOf(rule[1]) >= 0 && update.indexOf(rule[1]) < pageIndex))
          isOrderOK = false
        if (rightRules.some((rule) => update.indexOf(rule[0]) >= 0 && update.indexOf(rule[0]) > pageIndex))
          isOrderOK = false
      })
      if (part === 'part1' && isOrderOK) {
        count += update[(update.length - 1) / 2]
      }
      if (part === 'part2' && !isOrderOK) {
        count += update[(fixUpdate(update).length - 1) / 2]
      }
    })
    return count
  }

  if (!params.skipPart1) {
    part1 = solveFor('part1')
  }
  if (!params.skipPart2) {
    part2 = solveFor('part2')
  }

  return { part1, part2 }
}
