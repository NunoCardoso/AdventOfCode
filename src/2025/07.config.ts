import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Laboratories',
    year: 2025,
    day: 7,
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
      part1: 21,
      part2: 40
    }
  },
  prod: {
    answers: {
      part1: 1690,
      part2: 221371496188107
    }
  }
}

export default config
