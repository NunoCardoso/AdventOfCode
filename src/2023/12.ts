import { Params } from 'aoc.d'

type Puzzle = [string, Array<number>]

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const puzzlePart1: Array<Puzzle> = []
  const puzzlePart2: Array<Puzzle> = []

  for await (const line of lineReader) {
    const [spring, values] = line.split(/\s/)
    puzzlePart1.push([spring, values.split(',').map(Number)])
    puzzlePart2.push([
      Array(5).fill(spring).join('?'),
      Array(5).fill(values).join(',').split(',').map(Number)
    ])
  }

  const getKey = (spring: string, values: Array<number>): string => spring + ';' + values.join(',')

  const deepFirst = (
    spring: string,
    values: Array<number>,
    cache: Map<string, number>,
    depth: number
  ): number => {
    // spring starts with . , just trim it
    if (spring.startsWith('.')) {
      spring = spring.match(/^\.*(.*?)\.*$/)![1]
    }

    log.debug(' '.repeat(depth) + 'deepFirst', spring, values)

    // no spring left, return OK if we are out of values
    // if we still have values, it means we are expecting more # or ?
    if (spring === '') {
      log.debug(' '.repeat(depth) + 'no spring', values.length === 0 ? 1 : 0)
      return values.length === 0 ? 1 : 0
    }

    // no values left, return OK if we have string with no #
    if (values.length === 0) {
      log.debug(' '.repeat(depth) + '$ no values left,', spring.indexOf('#') < 0 ? 1 : 0)
      return spring.indexOf('#') < 0 ? 1 : 0
    }

    const key = getKey(spring, values)
    if (cache.has(key)) {
      log.debug(' '.repeat(depth) + 'hit cache', cache.get(key))
      return cache.get(key)!
    }

    let result = 0

    // spring starts with ?  => treat as ., keep drilling
    if (spring.startsWith('?')) {
      result += deepFirst(spring.substring(1, spring.length), values, cache, depth + 1)
      log.debug(' '.repeat(depth) + 'Condition 1 returned', result)
    }

    // spring starts with ? or with # => treat as #, keep drilling
    if (spring.startsWith('#') || spring.startsWith('?')) {
      const snippet = spring.substring(0, values[0])
      const newSpring = spring.substring(values[0], spring.length)
      log.debug(' '.repeat(depth) + 'snippet', snippet, 'newSpring', newSpring, 'values[0]', values[0])
      if (
        // there is enough input to fill out the next value, as in "?????" and value = 2
        values[0] <= spring.length &&
        // there is not dot in the snippet to spoil
        snippet.indexOf('.') < 0 &&
        // there is nothing more after this snippet
        (spring.length === values[0] ||
          // or there is something more, but it does not start with a #
          !newSpring.startsWith('#'))
      ) {
        // we slice another character as the next character HAS to be a . or a ?, to make a block valid
        const newNewSpring = newSpring.substring(1, newSpring.length)
        const newValues = values.slice(1, values.length)
        result += deepFirst(newNewSpring, newValues, cache, depth + 1)
        log.debug(' '.repeat(depth) + 'Condition 2 returned', result)
      }
    }

    cache.set(key, result)
    return result
  }

  const solveFor = (puzzles: Array<Puzzle>): number => {
    const cache = new Map<string, number>()
    return puzzles.reduce((acc, puzzle) => acc + deepFirst(puzzle[0], puzzle[1], cache, 0), 0)
  }

  if (!params.skipPart1) {
    part1 = solveFor(puzzlePart1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(puzzlePart2)
  }

  return { part1, part2 }
}
