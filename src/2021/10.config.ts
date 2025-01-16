import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Syntax Scoring',
    year: 2021,
    day: 10,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  ui: { show: true, end: true },
  test: {
    id: 'test',
    answers: {
      part1: 26397,
      part2: 288957
    }
  },
  prod: {
    answers: {
      part1: 321237,
      part2: 2360030859
    }
  }
}

export default config
