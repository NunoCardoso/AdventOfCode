import { Params } from 'aoc.d'
const SparkMD5 = require('spark-md5')

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: string = ''
  let part2: string = ''

  const solutionPart1: Array<string> = []
  let solutionsPart2: number = 0
  const solutionPart2: Array<string> = []
  let i: number = 0

  log.info('This will take some time, MD5 puzzle')

  while (solutionsPart2 < 8) {
    const hash: string = SparkMD5.hash(params.secretKey + i)
    if (hash.startsWith('00000')) {
      const position = hash.substring(5, 6)
      const character = hash.substring(6, 7)
      if (solutionPart1.length < 8) {
        log.debug('part1: adding', position, 'to', solutionPart1)
        solutionPart1.push(position)
      }
      if (position.match(/[0-7]/) && !solutionPart2[+position]) {
        log.debug('part2: adding', character, 'to', solutionPart2)
        solutionsPart2++
        solutionPart2[+position] = character
      }
    }
    if (i % 1000000 === 0) log.debug('Searching', i)
    i++
  }
  part1 = solutionPart1.join('')
  part2 = solutionPart2.join('')

  return { part1, part2 }
}
