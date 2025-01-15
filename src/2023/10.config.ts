import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 10,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  ui: {
    show: true
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 8
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 4
      }
    },
    {
      id: 'test3',
      answers: {
        part2: 8
      }
    },
    {
      id: 'test4',
      answers: {
        part2: 10
      }
    }
  ],
  prod: {
    answers: {
      part1: 6717,
      part2: 381
    }
  }
}

export default config
