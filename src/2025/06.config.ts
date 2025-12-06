import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Trash Compactor',
    year: 2025,
    day: 6,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 2
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 4277556,
      part2: 3263827
    }
  },
  prod: {
    answers: {
      part1: 7229350537438,
      part2: 11479269003550
    }
  }
}

export default config
