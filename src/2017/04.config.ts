import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'High-Entropy Passphrases',
    year: 2017,
    day: 4,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    comment: 'Simple rearranging words for list size comparison',
    difficulty: 1
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 2
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
      part1: 466,
      part2: 251
    }
  }
}

export default config
