import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'The Tyranny of the Rocket Equation',
    year: 2019,
    day: 1,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 2 + 2 + 654 + 33583
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 2 + 966 + 50346
      }
    }
  ],
  prod: {
    answers: {
      part1: 3412207,
      part2: 5115436
    }
  }
}

export default config
