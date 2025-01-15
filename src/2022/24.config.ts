import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 24,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'too long, but it finishes with right solution'
  },
  ui: {
    show: true,
    during: false,
    end: true,
    wait: 10
  },
  test: {
    id: 'test',
    answers: {
      part1: 18,
      part2: 54
    }
  },
  prod: {
    answers: {
      part1: 305,
      part2: 905
    }
  }
}

export default config
