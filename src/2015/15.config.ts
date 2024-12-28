import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Science for Hungry People',
    year: 2015,
    day: 15,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  params: {
    calories: {
      part2: 500
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 62842880,
      part2: 57600000
    }
  },
  prod: {
    answers: {
      part1: 18965440,
      part2: 15862900
    }
  }
}

export default config
