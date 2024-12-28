import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2015,
    day: 19,
    title: 'Medicine for Rudolph',
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 4,
        part2: 3
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 7,
        part2: 6
      }
    }
  ],
  prod: {
    answers: {
      part1: 576,
      part2: 207
    }
  }
}

export default config
