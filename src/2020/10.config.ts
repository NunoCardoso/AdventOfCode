import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Adapter Array',
    year: 2020,
    day: 10,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 35,
        part2: 8
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 220,
        part2: 19208
      }
    }
  ],
  prod: {
    answers: {
      part1: 2100,
      part2: 16198260678656
    }
  }
}

export default config
