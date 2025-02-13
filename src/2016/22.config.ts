import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Grid Computing',
    year: 2016,
    day: 22,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'clean',
    difficulty: 5,
    tags: ['Path-finding']
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      //   part2: 7
    }
  },
  prod: {
    answers: {
      part1: 892
      // part2: 0
    }
  }
}

export default config
