import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Handy Haversacks',
    year: 2020,
    day: 7,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 0
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 4
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 126
      }
    }
  ],
  prod: {
    answers: {
      part1: 348,
      part2: 18885
    }
  }
}

export default config
