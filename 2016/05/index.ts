import { Params } from '../../aoc.d'
import _ from 'lodash'
const MD5 = require('md5.js')

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = '',
    part2: string = ''

  const solutionPart1: Array<string> = []
  const solutionPart2Index: Array<string> = []
  const solutionPart2: Array<string> = []
  let i: number = 0

  while (solutionPart2Index.length < 8) {
    const hash: string = params.secretKey + i
    const res: string = new MD5().update('' + hash).digest('hex')
    if (res.startsWith('00000')) {
      const sol = res.substring(5, 6)
      const sol2 = res.substring(6, 7)
      if (solutionPart1.length < 8) {
        log.debug('part1: adding sol', sol, 'to', solutionPart1)
        solutionPart1.push(sol)
      }

      if (sol.match(/[0-7]/) && solutionPart2Index.indexOf(sol) < 0) {
        log.debug('part2: adding index', sol, 'to', solutionPart2Index)
        log.debug('part2: adding sol', sol2, 'to', solutionPart2)
        solutionPart2Index.push(sol)
        solutionPart2.push(sol2)
      }
    }
    i++
    if (i % 1000000 === 0) {
      log.debug('Searching', i)
    }
  }

  part1 = solutionPart1.join('')

  for (let i = 0; i < 8; i++) {
    part2 += solutionPart2[solutionPart2Index.indexOf(i.toString())]
  }

  return {
    part1,
    part2
  }
}
