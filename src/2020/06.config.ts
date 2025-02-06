import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Custom Customs',
    year: 2020,
    day: 6,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 11,
      part2: 6
    }
  },
  prod: {
    answers: {
      part1: 6549,
      part2: 3466
    }
  }
}

export default config
