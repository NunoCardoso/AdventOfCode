import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Packet Decoder',
    year: 2021,
    day: 16,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 3,
    tags: ['Recursion']
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 16
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 12
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 23
      }
    },
    {
      id: 'test4',
      answers: {
        part1: 31
      }
    },
    {
      id: 'test5',
      answers: {
        part2: 3
      }
    },
    {
      id: 'test6',
      answers: {
        part2: 54
      }
    },
    {
      id: 'test7',
      answers: {
        part2: 7
      }
    },
    {
      id: 'test8',
      answers: {
        part2: 9
      }
    },
    {
      id: 'test9',
      answers: {
        part2: 1
      }
    },
    {
      id: 'test10',
      answers: {
        part2: 0
      }
    },
    {
      id: 'test11',
      answers: {
        part2: 0
      }
    },
    {
      id: 'test12',
      answers: {
        part2: 1
      }
    }
  ],
  prod: {
    answers: {
      part1: 913,
      part2: 1510977819698
    }
  }
}

export default config
