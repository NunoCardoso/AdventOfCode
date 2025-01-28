import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Blizzard Basin',
    year: 2022,
    day: 24,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 5,
    tags: ['Breadth-first', 'Path-finding']
  },
  logLevel: 'info',
  ui: {
    show: false,
    during: true,
    end: true,
    wait: 10
  },
  test: {
    id: 'test',
    answers: {
      part1: 18,
      part2: 54
    }
  },
  prod: {
    answers: {
      part1: 305,
      part2: 905
    }
  }
}

export default config
