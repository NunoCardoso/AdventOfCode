import { Params } from 'aoc.d'

export const getPatternForIndex = (i: number, currentState: string[]) =>
  [i - 2, i - 1, i, i + 1, i + 2].map((index) => {
    if (index < 0) return '.'
    if (index > currentState.length - 1) return '.'
    return currentState[index]
  })

export const setPatternForIndex = (i: number, pattern: string, currentState: string[], negativeState: string[]) =>
  i < 0 ? (negativeState[Math.abs(i)] = pattern) : (currentState[i] = pattern)

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  let initialState: string = ''
  let rules: Record<string, string> = {}
  for await (const line of lineReader) {
    if (initialState === '') {
      initialState = line.substring('initial state: '.length, line.length)
      continue
    }
    if (line.startsWith('.') || line.startsWith('#')) {
      let values = line.split(' => ')
      rules[values[0]] = values[1]
    }
  }

  const solveFor = (initialState: string, maxIterations: number): number => {
    let iterations = 0
    let negativeStateShift = 0 // we shift negative stuff to current, but we need to keep track
    // where hte index 0 is
    let currentState: string[] = initialState.split('')
    let locked = false
    while (iterations < maxIterations && !locked) {
      iterations++

      let stretchLeft = currentState.indexOf('#') - 2
      let stretchRight = currentState.lastIndexOf('#') + 2

      let nextState: string[] = []
      let nextNegativeState: string[] = []

      for (var i = stretchLeft; i <= stretchRight; i++) {
        let pattern = getPatternForIndex(i, currentState)
        let patternString = pattern.join('')
        setPatternForIndex(i, rules[patternString] ?? '.', nextState, nextNegativeState)
      }

      if (nextNegativeState.lastIndexOf('#') > 0) {
        // start with 1, as we will ignore the 0 in negativeState, that is defined in th currentState
        let relevantNegativeState = nextNegativeState.slice(1, nextNegativeState.lastIndexOf('#') + 1)
        // reverse it, shift it to currentState, then compensate the index 0
        nextState = relevantNegativeState.reverse().concat(nextState)
        negativeStateShift -= relevantNegativeState.length
      }

      let lastHash = nextState.indexOf('#')
      // if we start on dots, we can reclaim them
      if (lastHash > 0) {
        nextState.splice(0, lastHash)
        negativeStateShift += lastHash
      }

      if (nextState.join('') === currentState.join('')) {
        console.log('Locked at iterations', iterations)
        locked = true
      }

      currentState = nextState

      log.debug(
        iterations,
        currentState.slice(0, negativeStateShift).join(''),
        '|',
        currentState.slice(negativeStateShift, currentState.length).join(''),
        negativeStateShift
      )
    }

    // part1
    if (!locked) {
      return currentState.reduce((acc, val, it) => acc + (val === '#' ? it + negativeStateShift : 0), 0)
    }

    // part2
    // at iteration 126, I am getting the same result, shifted 1 place to the right (index at 47)
    // so at iteration 50.000.000.000, I should have a negative shift of 50.000.000.000 + 47 - 126
    let newNegativeStateShift = maxIterations + negativeStateShift - iterations
    return currentState.reduce((acc, val, it) => acc + (val === '#' ? it + newNegativeStateShift : 0), 0)
  }

  if (!params.skipPart1) {
    part1 = solveFor(initialState, params.generations.part1)
  }
  if (!params.skipPart2) {
    part2 = solveFor(initialState, params.generations.part2)
  }

  return { part1, part2 }
}
