import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Handheld Halting',
    year: 2020,
    day: 8,
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
      part1: 5,
      part2: 8
    }
  },
  prod: {
    answers: {
      part1: 1749,
      part2: 515
    }
  }
}

export default config
