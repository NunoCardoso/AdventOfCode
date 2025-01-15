import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 7,
    title: 'Bridge Repair',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Simple, but I guess part 2 can have optimization',
    difficulty: 2
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 3749,
      part2: 11387
    }
  },
  prod: {
    answers: {
      part1: 5837374519342,
      part2: 492383931650959
    }
  }
}

export default config
