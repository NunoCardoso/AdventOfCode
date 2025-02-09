import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Seating System',
    year: 2020,
    day: 11,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  logLevel: 'debug',
  ui: { show: false },
  test: {
    id: 'test',
    answers: {
      part1: 37,
      part2: 26
    }
  },
  prod: {
    answers: {
      part1: 2453,
      part2: 2159
    }
  }
}

export default config
