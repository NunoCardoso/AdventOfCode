import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 14,
    title: 'Restroom Redoubt',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'Nice heuristic to see if I can detect a picture on part 2, nice to see if AI can do it',
    difficulty: 3
  },
  logLevel: 'info',
  ui: { show: true },
  test: [
    {
      id: 'test',
      params: {
        iterations: 100,
        worldSize: [11, 7]
      },
      answers: {
        part1: 12
      }
    }
  ],
  params: {
    iterations: 100,
    worldSize: [101, 103]
  },
  prod: {
    answers: {
      part1: 229839456,
      part2: 7138
    }
  }
}

export default config
