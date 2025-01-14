import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Inventory Management System',
    year: 2018,
    day: 2,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test',
      answers: {
        part1: 12
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 'fgij'
      }
    }
  ],
  prod: {
    answers: {
      part1: 6175,
      part2: 'asgwjcmzredihqoutcylvzinx'
    }
  }
}

export default config
