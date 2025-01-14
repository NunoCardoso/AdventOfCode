import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Hex Ed',
    year: 2017,
    day: 11,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 3
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 0
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 2
      }
    },
    {
      id: 'test4',
      answers: {
        part1: 3
      }
    }
  ],
  prod: {
    answers: {
      part1: 643,
      part2: 1471
    }
  }
}

export default config
