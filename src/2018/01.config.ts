import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2018,
    day: 1,
    title: 'Chronal Calibration',
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
        part2: 0
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 10
      }
    },
    {
      id: 'test3',
      answers: {
        part2: 5
      }
    },
    {
      id: 'test4',
      answers: {
        part2: 14
      }
    }
  ],
  prod: {
    answers: {
      part1: 445,
      part2: 219
    }
  }
}

export default config
