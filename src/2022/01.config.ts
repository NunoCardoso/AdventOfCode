import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 1,
    title: 'Calorie Counting',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Functional puzzle, doing counts while parsing input, returning top counts'
  },
  test: {
    id: 'test',
    answers: {
      part1: 24000,
      part2: 45000
    }
  },
  prod: {
    answers: {
      part1: 66487,
      part2: 197301
    }
  }
}

export default config
