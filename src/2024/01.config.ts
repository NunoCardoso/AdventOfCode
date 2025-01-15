import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 1,
    title: 'Historian Hysteria',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Simple list sort and reduce. A little hiccup on unsure if distances can be negative',
    difficulty: 1
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 11,
      part2: 31
    }
  },
  prod: {
    answers: {
      part1: 1110981,
      part2: 24869388
    }
  }
}

export default config
