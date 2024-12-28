import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'RPG Simulator 20XX',
    year: 2015,
    day: 21,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  test: {
    id: 'test',
    params: {
      hitPoints: 8
    },
    answers: {
      part1: 65,
      part2: 148
    }
  },
  prod: {
    params: {
      hitPoints: 100
    },
    answers: {
      part1: 78,
      part2: 148
    }
  }
}

export default config
