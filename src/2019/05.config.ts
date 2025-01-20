import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Sunny with a Chance of Asteroids',
    year: 2019,
    day: 5,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test2',
      params: {
        input: {
          part2: 7
        }
      },
      answers: {
        part2: 999
      }
    }
  ],
  prod: {
    params: {
      input: {
        part1: 1,
        part2: 5
      }
    },
    answers: {
      part1: 6761139,
      part2: 9217546
    }
  }
}

export default config
