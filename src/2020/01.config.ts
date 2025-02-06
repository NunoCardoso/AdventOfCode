import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Report Repair',
    year: 2020,
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
      part1: 514579,
      part2: 241861950
    }
  },
  prod: {
    answers: {
      part1: 1003971,
      part2: 84035952
    }
  }
}

export default config
