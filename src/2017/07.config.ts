import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Recursive circus',
    year: 2017,
    day: 1,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Hard to understand the instructions, not a nice puzzle but done',
    difficulty: 2,
    tags: ['Recursion']
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 'tknk',
      part2: 60
    }
  },
  prod: {
    answers: {
      part1: 'cyrupz',
      part2: 193
    }
  }
}

export default config
