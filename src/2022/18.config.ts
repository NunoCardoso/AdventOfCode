import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Boiling Boulders',
    year: 2022,
    day: 18,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  ui: {
    show: false,
    wait: 100
  },
  test: {
    id: 'test',
    answers: {
      part1: 64,
      part2: 58
    }
  },
  prod: {
    answers: {
      part1: 4450,
      part2: 2564
    }
  }
}

export default config
