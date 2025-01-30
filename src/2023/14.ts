import { Params } from 'aoc.d'
import { range } from 'util/range'

type Cache = Map<string, [number, number]>
type CacheHit = [number, [number, number]] | undefined

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const printColumns = (columns: string[]) => {
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

  // transpose input
  let columns: string[] = []
  for await (const line of lineReader) {
    if (columns.length === 0) columns = new Array(line.length).fill('')
    line.split('').forEach((char: string, colIndex: number) => (columns[colIndex] += char))
  }

  if (!params.skipPart1) {
    if (params.ui?.show) printColumns(columns!)
    part1 = columns!.map((column: string) => score(tiltColumn(column))).reduce((a, b) => a + b)
  }

  if (!params.skipPart2) {
    let iterations = 0
    const cache: Cache = new Map()
    let cacheHit: CacheHit

    while (!cacheHit) {
      range(4).forEach(() => (columns = rotate90(columns!.map(tiltColumn))))

      // let's make a snapshot of this world
      const columnSnapshot = columns!.reduce((a, b) => a + b, '')
      const columnScore = columns!.map(score).reduce((a, b) => a + b)

      if (!cache.has(columnSnapshot)) cache.set(columnSnapshot, [iterations, columnScore])
      else if (!cacheHit) cacheHit = [iterations, cache.get(columnSnapshot)!]
      iterations++
    }

    const firstRepeatedCycle = cacheHit[1][0]
    const delta = cacheHit[0] - firstRepeatedCycle
    const repeatedCycleIndex = ((params.cycles - 1 - firstRepeatedCycle) % delta) + firstRepeatedCycle
    part2 = [...cache.values()].find((val) => val[0] === repeatedCycleIndex)![1]
  }

  return { part1, part2 }
}
