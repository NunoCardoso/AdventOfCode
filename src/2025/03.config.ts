import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Lobby',
    year: 2025,
    day: 3,
    result: 'unfinished',
    status: 'unsolved',
    speed: 'fast',
    code: 'dirty',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 357,
      part2: 3121910778619
    }
  },
  prod: {
    answers: {
      part1: 17359
      //part2: 0
    }
  }
}

export default config
