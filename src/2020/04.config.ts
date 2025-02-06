import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Passport Processing',
    year: 2020,
    day: 4,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 2
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
      part1: 222,
      part2: 140
    }
  }
}

export default config
