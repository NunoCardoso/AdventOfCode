import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Stream Processing',
    year: 2017,
    day: 9,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'It actually was easier than I thought',
    difficulty: 2
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: { part1: 1 }
    },
    {
      id: 'test2',
      answers: { part1: 6 }
    },
    {
      id: 'test3',
      answers: { part1: 5 }
    },
    {
      id: 'test4',
      answers: { part1: 16 }
    },
    {
      id: 'test5',
      answers: { part1: 1 }
    },
    {
      id: 'test6',
      answers: { part1: 9 }
    },
    {
      id: 'test7',
      answers: { part1: 9 }
    },
    {
      id: 'test8',
      answers: { part1: 3 }
    }
  ],
  prod: {
    answers: {
      part1: 11846,
      part2: 6285
    }
  }
}

export default config
