import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Security Through Obscurity',
    year: 2016,
    day: 4,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      params: {
        needle: 'very encrypted name'
      },
      answers: {
        part1: 1514
      }
    },
    {
      id: 'test2',
      params: {
        needle: 'very encrypted name'
      },
      answers: {
        part2: 343
      }
    }
  ],
  prod: {
    params: {
      needle: 'northpole object storage'
    },
    answers: {
      part1: 361724,
      part2: 482
    }
  }
}

export default config
