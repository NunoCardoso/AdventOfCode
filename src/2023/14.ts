import { Params } from 'aoc.d'

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let columns: Array<string> | undefined

  for await (const line of lineReader) {
    if (!columns) columns = new Array(line.length).fill('')
    line.split('').forEach((char: string, i: number) => (columns![i] += char))
  }

  const printColumns = (columns: Array<string>) => {
    for (let i = 0; i < columns[0].length; i++) {
      let l = ''
      for (let j = 0; j < columns.length; j++) {
        l += columns[j][i]
      }
      console.log(l)
    }
    console.log('\n')
  }

  const score = (column: string): number =>
    column
      .split('')
      .map((c: string, i: number) => (c === 'O' ? column.length - i : 0))
      .reduce((a, b) => a + b, 0)

  const rotate90 = (columns: Array<string>): Array<string> => {
    const newColumns: Array<string> = Array(columns[0].length).fill('')
    for (let i = 0; i < columns.length; i++) {
      for (let j = 0; j < columns[0].length; j++) {
        newColumns[newColumns.length - 1 - j] += columns[i][j]
      }
    }
    return newColumns
  }

  const tiltColumn = (column: string): string =>
    column
      .split('#')
      .map((split: string) => {
        const numberOfOs = split.match(/O/g)?.length ?? 0
        return 'O'.repeat(numberOfOs) + '.'.repeat(split.length - numberOfOs)
      })
      .join('#')

  if (!params.skipPart1) {
    if (params.ui.show) {
      printColumns(columns!)
    }
    part1 = columns!.map((column: string) => score(tiltColumn(column))).reduce((a, b) => a + b)
  }

  if (!params.skipPart2) {
    let i = 0
    const cache: Map<string, [number, number]> = new Map()
    let cacheHit: [number, [number, number]] | undefined

    while (!cacheHit) {
      ;['north', 'west', 'south', 'east'].forEach((dir: string) => {
        log.debug('tilting and rotating on', dir)
        columns = rotate90(columns!.map(tiltColumn))
      })

      // let's make a snapshot of this world
      const columnSnapshot = columns!.reduce((a, b) => a + b, '')
      const columnScore = columns!.map(score).reduce((a, b) => a + b)

      if (!cache.has(columnSnapshot)) cache.set(columnSnapshot, [i, columnScore])
      else if (!cacheHit) cacheHit = [i, cache.get(columnSnapshot)!]
      i++
    }
    /* so, in test, I get cacheHit at [ 9, [ 2, 69 ] ]
    Meaning that I did 3 cycles (iteration 0-2), and then there was a repeat on 7 cycles (iteration 3-9)

    To know the repeated cycle index that matches the (1000000000 - 1) cycle,
    subtract 2 (first repeat cycle index) => 999999997, then mod it to the delta (999999997 % 7 = 3)
    I need the score of the 3rd repeat cycle, so, first repeat cycle index (2) + 3 = cycle 5 from cache.
    scores are already computed in the cache as [1][1]
    */
    const firstRepeatedCycle = cacheHit[1][0]
    const delta = cacheHit[0] - firstRepeatedCycle
    const repeatedCycleIndex = ((params.cycles - 1 - firstRepeatedCycle) % delta) + firstRepeatedCycle
    const cachedCycle: Array<number> | undefined = Array.from(cache.values()).find((val) => val[0] === repeatedCycleIndex)
    part2 = cachedCycle![1]
  }

  return { part1, part2 }
}
