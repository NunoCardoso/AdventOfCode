import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 16,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: '37s without cache, cache goes memory busted'
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 46,
      part2: 51
    }
  },
  prod: {
    answers: {
      part1: 7060,
      part2: 7493
    }
  }
}

export default config
