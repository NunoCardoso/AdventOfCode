import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 16,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'over 1 min, errors on test part2, error on part 2 value (execution is fine)'
  },
  params: {
    limit: {
      part1: 30,
      part2: 26
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 1651,
      part2: 1707
    }
  },
  prod: {
    answers: {
      part1: 2124,
      part2: 2775
    }
  }
}

export default config
