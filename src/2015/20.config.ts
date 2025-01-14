import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2015,
    day: 20,
    title: 'Infinite Elves and Infinite Houses',
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  test: {
    id: 'test',
    params: {
      threshold: 150,
      maxHousePresents: 50,
      elfMultiplier: {
        part1: 10,
        part2: 11
      }
    },
    answers: {
      part1: 8
    }
  },
  prod: {
    params: {
      threshold: 33100000,
      maxHousePresents: 50,
      elfMultiplier: {
        part1: 10,
        part2: 11
      }
    },
    answers: {
      part1: 776160,
      part2: 786240
    }
  }
}

export default config
