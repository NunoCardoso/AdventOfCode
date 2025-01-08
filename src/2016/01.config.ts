import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'No Time for a Taxicab',
    year: 2016,
    day: 1,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 5
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 2
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 12
      }
    },
    {
      id: 'test4',
      answers: {
        part2: 4
      }
    }
  ],
  prod: {
    answers: {
      part1: 279,
      part2: 163
    }
  }
}

export default config
