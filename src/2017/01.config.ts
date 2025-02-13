import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Inverse Captcha',
    year: 2017,
    day: 1,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 1
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 3
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 4
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 0
      }
    },
    {
      id: 'test4',
      answers: {
        part1: 9
      }
    },
    {
      id: 'test5',
      answers: {
        part2: 6
      }
    },
    {
      id: 'test6',
      answers: {
        part2: 0
      }
    },
    {
      id: 'test7',
      answers: {
        part2: 4
      }
    },
    {
      id: 'test8',
      answers: {
        part2: 12
      }
    },
    {
      id: 'test9',
      answers: {
        part2: 4
      }
    }
  ],
  prod: {
    answers: {
      part1: 1175,
      part2: 1166
    }
  }
}

export default config
