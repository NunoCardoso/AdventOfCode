import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 13,
    title: 'Claw Contraption',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment:
      'Actually very easy, once you understand that it is just a pair of lines and solution is in the interception',
    difficulty: 1
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 480
    }
  },
  prod: {
    answers: {
      part1: 36758,
      part2: 76358113886726
    }
  }
}

export default config
