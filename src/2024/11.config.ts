import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 11,
    title: 'Plutonian Pebbles',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Same but with cache, results are same time',
    difficulty: 4
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 55312
    }
  },
  mode: 'cache',
  params: {
    iterations: {
      part1: 25,
      part2: 75
    }
  },
  prod: {
    answers: {
      part1: 197157,
      part2: 234430066982597
    }
  }
}

export default config
