import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 9,
    title: 'Rope Bridge',
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  params: {
    ropeLength: {
      part1: 2,
      part2: 10
    }
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 13
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 36
      }
    }
  ],
  prod: {
    answers: {
      part1: 6367,
      part2: 2536
    }
  }
}

export default config
