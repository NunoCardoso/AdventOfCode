import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Lanternfish',
    year: 2021,
    day: 6,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  params: {
    days: {
      part1: 80,
      part2: 256
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 5934,
      part2: 26984457539
    }
  },
  prod: {
    answers: {
      part1: 360761,
      part2: 1632779838045
    }
  }
}

export default config
