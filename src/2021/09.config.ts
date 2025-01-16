import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Smoke Basin',
    year: 2021,
    day: 9,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  ui: { show: false, end: true },
  test: {
    id: 'test',
    answers: {
      part1: 15,
      part2: 1134
    }
  },
  prod: {
    answers: {
      part1: 564,
      part2: 1038240
    }
  }
}

export default config
