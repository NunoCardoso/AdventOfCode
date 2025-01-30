import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Pipe Maze',
    year: 2023,
    day: 10,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3,
    tags: ['Path-finding', 'Breadth-first']
  },
  ui: {
    show: true
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 8
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 4
      }
    },
    {
      id: 'test3',
      answers: {
        part2: 8
      }
    },
    {
      id: 'test4',
      answers: {
        part2: 10
      }
    }
  ],
  prod: {
    answers: {
      part1: 6717,
      part2: 381
    }
  }
}

export default config
