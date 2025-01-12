import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'A Maze of Twisty Trampolines, All Alike',
    year: 2017,
    day: 5,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Done, jumps in a list.',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 5,
      part2: 10
    }
  },
  prod: {
    answers: {
      part1: 391540,
      part2: 30513679
    }
  }
}

export default config
