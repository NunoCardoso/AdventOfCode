import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Digital Plumber',
    year: 2017,
    day: 12,
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
      part1: 6,
      part2: 2
    }
  },
  prod: {
    answers: {
      part1: 115,
      part2: 221
    }
  }
}

export default config
