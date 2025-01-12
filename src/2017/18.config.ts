import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Duet',
    year: 2017,
    day: 18,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Damn hard to make it right, the receive and send order was hard, so was pop() or shift()',
    difficulty: 4
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 4
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 3
      }
    }
  ],
  prod: {
    answers: {
      part1: 8600,
      part2: 7239
    }
  }
}

export default config
