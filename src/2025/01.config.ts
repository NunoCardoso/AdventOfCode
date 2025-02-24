import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Secret Entrance',
    year: 2025,
    day: 1,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 3,
      part2: 6
    }
  },
  params: {
    initialValue: 50,
    numberOfPositions: 100
  },
  prod: {
    answers: {
      part1: 1076,
      part2: 6379
    }
  }
}

export default config
