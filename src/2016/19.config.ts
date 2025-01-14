import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'An Elephant Named Joseph',
    year: 2016,
    day: 19,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  // mode: 'study',
  test: {
    id: 'test',
    params: {
      elves: 5
    },
    answers: {
      part1: 3,
      part2: 2
    }
  },
  prod: {
    params: {
      elves: 3018458
    },
    answers: {
      part1: 1842613,
      part2: 1424135
    }
  }
}

export default config
