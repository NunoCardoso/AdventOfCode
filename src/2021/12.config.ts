import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Passage Pathing',
    year: 2021,
    day: 12,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 0,
    tags: ['Breadth-first', 'Path-finding']
  },
  logLevel: 'info',
  ui: { show: false, during: true },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 10,
        part2: 36
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 19,
        part2: 103
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 226,
        part2: 3509
      }
    }
  ],
  prod: {
    answers: {
      part1: 3713,
      part2: 91292
    }
  }
}

export default config
