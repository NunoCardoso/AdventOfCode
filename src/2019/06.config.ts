import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Universal Orbit Map',
    year: 2019,
    day: 6,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 42
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 4
      }
    }
  ],
  prod: {
    answers: {
      part1: 200001,
      part2: 379
    }
  }
}

export default config
