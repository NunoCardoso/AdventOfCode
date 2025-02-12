import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Docking Data',
    year: 2020,
    day: 14,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 165
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 208
      }
    }
  ],
  prod: {
    answers: {
      part1: 14722016054794,
      part2: 3618217244644
    }
  }
}

export default config
