import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Spinlock',
    year: 2017,
    day: 17,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment:
      'Yeah, optimizing part 2 is needed, luckily 0 always stays on index 0 so I can do the calculation without having to keep an array',
    difficulty: 4
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 638
    }
  },
  params: {
    iterations: {
      part1: 2017,
      part2: 50000000
    }
  },
  prod: {
    answers: {
      part1: 417,
      part2: 34334221
    }
  }
}

export default config
