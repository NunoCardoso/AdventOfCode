import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Radioisotope Thermoelectric Generators',
    year: 2016,
    day: 11,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4,
    tags: ['Path-finding']
  },
  ui: {
    show: false,
    end: true
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 11
    }
  },
  prod: {
    answers: {
      part1: 37,
      part2: 61
    }
  }
}

export default config
