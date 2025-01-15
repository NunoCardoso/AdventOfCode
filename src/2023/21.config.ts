import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 21,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    title: 'Step Counter'
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      steps: {
        part1: 6,
        part2: 10
      }
    },
    answers: {
      part1: 16,
      part2: 50
    }
  },
  prod: {
    params: {
      steps: {
        part1: 64,
        part2: 26501365
      }
    },
    answers: {
      part1: 3729,
      part2: 621289922886149
    }
  }
}

export default config
