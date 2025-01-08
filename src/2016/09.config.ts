import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2016,
    day: 9,
    title: 'Explosives in Cyberspace',
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3,
    tags: ['Recursion']
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 18
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 445
      }
    },
    {
      id: 'test3',
      answers: {
        part2: 241920
      }
    }
  ],
  prod: {
    answers: {
      part1: 70186,
      part2: 10915059201
    }
  }
}

export default config
