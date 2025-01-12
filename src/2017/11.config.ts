import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Hex Ed',
    year: 2017,
    day: 11,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'I guess step 2 can be optimized, to avoid repeat',
    difficulty: 2
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 3
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 0
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 2
      }
    },
    {
      id: 'test4',
      answers: {
        part1: 3
      }
    }
  ],
  prod: {
    answers: {
      part1: 643,
      part2: 1471
    }
  }
}

export default config
