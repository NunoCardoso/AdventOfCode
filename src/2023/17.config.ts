import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2023,
    day: 17,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'slow, 3 min, try depth first?'
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 102,
        part2: 94
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 71
      }
    }
  ],
  prod: {
    answers: {
      part1: 635,
      part2: 734
    }
  }
}

export default config
