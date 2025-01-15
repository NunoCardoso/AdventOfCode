import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 13,
    title: 'Distress Signal',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Somehow I managed to not mess up the recursion, which is quite interesting',
    tags: ['recursion']
  },
  test: {
    id: 'test',
    answers: {
      part1: 13,
      part2: 140
    }
  },
  prod: {
    answers: {
      part1: 5684,
      part2: 22932
    }
  }
}

export default config
