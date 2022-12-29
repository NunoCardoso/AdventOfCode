import { Params } from '../../aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let rawCount = 0
  let processedCount1 = 0
  let processedCount2 = 0

  for await (const line of lineReader) {
    let processedLine = line
    processedLine = processedLine
      .replaceAll(/\\x[0-9a-f][0-9a-f]/g, '_')
      .replaceAll(/\\"/g, '"')
      .replaceAll(/\\\\/g, '\\')
    const m = processedLine.match(/^"(.*)"$/)
    processedLine = m[1]
    log.debug('line', line, line.length, 'processed line', processedLine, processedLine.length)
    rawCount += line.length
    processedCount1 += processedLine.length

    const processedLine2 = JSON.stringify(line)
    log.debug('line', line, line.length, 'processed line', processedLine2, processedLine2.length)
    processedCount2 += JSON.stringify(line).length
  }

  return {
    part1: rawCount - processedCount1,
    part2: Math.abs(rawCount - processedCount2)
  }
}
