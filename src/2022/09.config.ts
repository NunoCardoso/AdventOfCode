import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2022,
    day: 9,
    title: 'Rope Bridge',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Good puzzle solution for any length'
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
