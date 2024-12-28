import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Like a GIF For Your Yard',
    year: 2015,
    day: 18,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3
  },
  ui: {
    show: true,
    during: false,
    end: true
  },
  test: [
    {
      id: 'test1',
      params: {
        limit: 4
      },
      answers: {
        part1: 4
      }
    },
    {
      id: 'test2',
      params: {
        limit: 5
      },
      answers: {
        part2: 17
      }
    }
  ],
  prod: {
    params: {
      limit: 100
    },
    answers: {
      part1: 768,
      part2: 781
    }
  }
}

export default config
