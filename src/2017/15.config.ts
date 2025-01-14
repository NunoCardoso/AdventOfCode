import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Dueling Generators',
    year: 2017,
    day: 15,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  test: {
    id: 'test',
    answers: {
      part1: 588,
      part2: 309
    }
  },
  mode: 'fastest',
  params: {
    remainder: 2147483647n,
    iterations: {
      part1: 40000000,
      part2: 5000000
    },
    generator: {
      A: 16807,
      B: 48271
    },
    generatorBigInt: {
      A: 16807n,
      B: 48271n
    }
  },
  prod: {
    answers: {
      part1: 594,
      part2: 328
    }
  }
}

export default config
