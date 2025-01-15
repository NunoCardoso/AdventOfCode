import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 6,
    title: 'Guard Gallivant',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment:
      'Takes 10 seconds but it gets there. Needs some optimization, lucky that map was not that big. Optimizations are on readme',
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 41,
      part2: 6
    }
  },
  prod: {
    answers: {
      part1: 5080,
      part2: 1919
    }
  }
}

export default config
