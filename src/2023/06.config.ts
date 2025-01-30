import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Wait For It',
    year: 2023,
    day: 6,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 0
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 288,
      part2: 71503
    }
  },
  prod: {
    answers: {
      part1: 1159152,
      part2: 41513103
    }
  }
}

export default config
