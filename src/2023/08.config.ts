import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 8,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
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
        part1: 6
      }
    },
    {
      id: 'test3',
      answers: {
        part2: 6
      }
    }
  ],
  prod: {
    answers: {
      part1: 21389,
      part2: 21083806112641
    }
  }
}

export default config
