import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Dive!',
    year: 2021,
    day: 2,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  test: {
    id: 'test',
    answers: {
      part1: 150,
      part2: 900
    }
  },
  prod: {
    answers: {
      part1: 2073315,
      part2: 1840311528
    }
  }
}

export default config
