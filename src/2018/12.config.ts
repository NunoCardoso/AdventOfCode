import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Subterranean Sustainability',
    year: 2018,
    day: 12,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 325
    }
  },
  params: {
    generations: {
      part1: 20,
      part2: 50000000000
    }
  },
  prod: {
    answers: {
      part1: 4386,
      part2: 5450000001166
    }
  }
}

export default config
