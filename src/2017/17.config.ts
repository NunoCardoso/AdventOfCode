import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Spinlock',
    year: 2017,
    day: 17,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
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
