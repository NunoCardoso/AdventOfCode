import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Encoding Error',
    year: 2020,
    day: 9,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      preamble: 5
    },
    answers: {
      part1: 127,
      part2: 62
    }
  },
  prod: {
    params: {
      preamble: 25
    },
    answers: {
      part1: 144381670,
      part2: 20532569
    }
  }
}

export default config
