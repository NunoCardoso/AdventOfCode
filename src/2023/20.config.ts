import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 20,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty'
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      params: {
        iterations: 1000
      },
      answers: {
        part1: 32000000
      }
    },
    {
      id: 'test2',
      params: {
        iterations: 1000
      },
      answers: {
        part1: 11687500
      }
    }
  ],
  prod: {
    params: {
      iterations: 1000
    },
    answers: {
      part1: 873301506,
      part2: 241823802412393
    }
  }
}

export default config
