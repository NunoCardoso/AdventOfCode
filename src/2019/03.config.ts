import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Crossed Wires',
    year: 2019,
    day: 3,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 159,
        part2: 610
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 135,
        part2: 410
      }
    }
  ],
  prod: {
    answers: {
      part1: 303,
      part2: 11222
    }
  }
}

export default config
