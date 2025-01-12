import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'I Heard You Like Registers',
    year: 2017,
    day: 8,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Just execute instructions and see where the ball lands',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 1,
      part2: 10
    }
  },
  prod: {
    answers: {
      part1: 5221,
      part2: 7491
    }
  }
}

export default config
