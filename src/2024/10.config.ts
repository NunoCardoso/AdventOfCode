import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 10,
    title: 'Hoof It',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Really simple path finding, interesting that I found solution for part2 before part1',
    difficulty: 2
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 36
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 81
      }
    }
  ],
  prod: {
    answers: {
      part1: 733,
      part2: 1514
    }
  }
}

export default config
