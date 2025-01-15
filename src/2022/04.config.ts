import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 4,
    title: 'Camp Cleanup',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment:
      'Functional puzzle, compacted the code to very hard to do the overlap logic and summing answers while parsing input'
  },
  test: {
    id: 'test',
    answers: {
      part1: 2,
      part2: 4
    }
  },
  prod: {
    answers: {
      part1: 560,
      part2: 839
    }
  }
}

export default config
