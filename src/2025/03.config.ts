import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Lobby',
    year: 2025,
    day: 3,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 357,
      part2: 3121910778619
    }
  },
  prod: {
    answers: {
      part1: 17359,
      part2: 172787336861064
    }
  }
}

export default config
