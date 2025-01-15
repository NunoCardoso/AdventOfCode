import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: '',
    year: 2018,
    day: 9,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 5,
    tags: ['Map-based-linked-lists']
  },
  mode: 'fastest',
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 32
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 8317
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 146373
      }
    },
    {
      id: 'test4',
      answers: {
        part1: 2764
      }
    },
    {
      id: 'test5',
      answers: {
        part1: 54718
      }
    },
    {
      id: 'test6',
      answers: {
        part1: 37305
      }
    }
  ],
  prod: {
    answers: {
      part1: 399645,
      part2: 3352507536
    }
  }
}

export default config
