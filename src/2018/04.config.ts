import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Repose Record',
    year: 2018,
    day: 4,
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
      part1: 240,
      part2: 4455
    }
  },
  prod: {
    answers: {
      part1: 84636,
      part2: 91679
    }
  }
}

export default config
