import { Params } from '../../aoc.d'
import _ from 'lodash'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  const dataForPart1: Array<{line1: string, line2: string}> = []
  const dataForPart2: Array<string> = []

  let lineno: number = 0; let line1: string = ''; let line2: string = ''
  for await (const line of lineReader) {
    if (lineno % 3 === 0) {
      line1 = line
    }
    if (lineno % 3 === 1) {
      line2 = line
    }
    if (lineno % 3 === 2) {
      dataForPart1.push({
        line1, line2
      })
    }
    if (line !== '') {
      dataForPart2.push(line)
    }
    lineno++
  }

  const compare = (d1: any, d2: any, indent: number): number => {
    if (_.isNumber(d1) && _.isNumber(d2)) {
      log.debug(' '.repeat(indent) + 'Compare n vs n', d1, 'vs', d2, ' =>', d1 < d2 ? -1 : d1 > d2 ? 1 : 0)
      return d1 < d2 ? -1 : d1 > d2 ? 1 : 0
    }
    if (Array.isArray(d1) && Array.isArray(d2)) {
      for (let i = 0; i < d1.length; i++) {
        if (i < d2.length) {
          const score: number = compare(d1[i], d2[i], indent + 2)
          if (score !== 0) {
            log.debug(' '.repeat(indent) + 'Compare a vs a', d1, 'vs', d2, ' on score =>', score)
            return score
          }
        }
      }
      return d1.length < d2.length ? -1 : d1.length > d2.length ? 1 : 0
    }

    if (_.isNumber(d1) && Array.isArray(d2)) {
      log.debug(' '.repeat(indent) + 'Compare n vs a', d1, ' vs ', d2, ' opt 1 =>', compare([d1], d2, indent + 2))
      return compare([d1], d2, 2)
    }
    if (_.isNumber(d2) && Array.isArray(d1)) {
      log.debug(' '.repeat(indent) + 'Compare a vs n', d1, ' vs ', d2, ' opt 2 =>', compare(d1, [d2], indent + 1))
      return compare(d1, [d2], 2)
    }
    log.error('shouldnt be here')
    return 0
  }

  let part1: number = 0; let part2: number = 0

  if (params.part1?.skip !== true) {
    dataForPart1.forEach((d, index) => {
      log.debug('=== Pair ', index, '====')
      log.debug('compare', d.line1, ' vs ', d.line2)
      const rightOrder: number = compare(JSON.parse(d.line1), JSON.parse(d.line2), 2)
      log.debug('Result', rightOrder, 'index', index)
      part1 = part1 + (rightOrder === -1 ? 1 : 0) * (index + 1)
    })
  }

  if (params.part2?.skip !== true) {
    dataForPart2.push('[[2]]')
    dataForPart2.push('[[6]]')
    dataForPart2.sort((a, b) =>
      compare(JSON.parse(a), JSON.parse(b), 2)
    )
    const index1 = dataForPart2.indexOf('[[2]]')
    const index2 = dataForPart2.indexOf('[[6]]')
    part2 = (index1 + 1) * (index2 + 1)
  }
  return {
    part1,
    part2
  }
}
