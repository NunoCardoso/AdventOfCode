import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let batteries: string[] = []

  type JoltageIndex = Record<string, number[]>

  for await (const line of lineReader) batteries.push(line)

  const findJoltage = (
    battery: string,
    joltageIndex: JoltageIndex,
    joltageLength: number,
    testJoltage: string[],
    currentJoltage: string,
    startIndex: number,
    max: number
  ): number => {
    log.debug('findJoltage for', battery, joltageLength, testJoltage, currentJoltage, startIndex, max)

    // we are running out of testVoltage numbers, return max
    if (testJoltage.length === 0) {
      log.debug('no more test joltage, return max', max)
      return max
    }
    // we are finished with the number, return the highest one
    if (joltageLength === 0) {
      let newMax = Math.max(Number(currentJoltage), max)
      log.debug('no more howMany, returning', newMax)
      return newMax
    }
    let test: string = testJoltage.pop()!
    if (!joltageIndex[test]) {
      // try next on template
      log.debug('no number', test, 'in', battery, 'going deeper')
      return findJoltage(battery, joltageIndex, joltageLength, testJoltage, currentJoltage, startIndex, max)
    }
    // this is hopeless, will never be higher than max
    let maxNumber = Number(currentJoltage + '9'.repeat(joltageLength))
    if (maxNumber < max) {
      log.debug('maxNumber', maxNumber, 'will never be bigger than max', max, 'leaving')
      return max
    }

    for (let index of joltageIndex[test]) {
      // index is from a number on the left, forget about it
      if (index < startIndex) {
        log.debug('index', index, 'left of startIndex', startIndex, 'skipping')
        continue
      }
      // too short, can't work, skipping
      if (index + joltageLength > battery.length) {
        log.debug(
          'index',
          index,
          'joltageLength',
          joltageLength,
          'battery.length',
          battery.length,
          'Too short, skipping'
        )
        continue
      }
      // collect and iterate
      log.debug('collecting and going deeper')
      return findJoltage(
        battery,
        joltageIndex,
        joltageLength - 1,
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        currentJoltage + '' + test,
        index + 1,
        max
      )
    }
    log.debug('looping')
    return findJoltage(battery, joltageIndex, joltageLength, testJoltage, currentJoltage, startIndex, max)
  }

  const solveFor = (joltageLength: number): number =>
    batteries.reduce((acc, battery, i) => {
      let joltageIndex: JoltageIndex = {} //indexes for each number, so I can analyse 9, then 8, etc
      battery.split('').forEach((joltage, index) => {
        if (joltageIndex[joltage] === undefined) joltageIndex[joltage] = []
        joltageIndex[joltage].push(index)
      })
      return (
        acc + findJoltage(battery, joltageIndex, joltageLength, ['1', '2', '3', '4', '5', '6', '7', '8', '9'], '', 0, 0)
      )
    }, 0)

  if (!params.skipPart1) part1 = solveFor(2)
  if (!params.skipPart2) part2 = solveFor(12)

  return { part1, part2 }
}
