import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 22,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'test does not work, have to reshape cube for test'
  },
  ui: {
    show: false
  },
  test: {
    params: {
      cubeSize: 4
    },
    id: 'test',
    answers: {
      part1: 6032,
      part2: 5031
    }
  },
  prod: {
    params: {
      cubeSize: 50
    },
    answers: {
      part1: 149138,
      part2: 153203
    }
  }
}

export default config
