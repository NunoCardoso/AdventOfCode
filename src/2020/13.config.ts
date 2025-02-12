import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Shuttle Search',
    year: 2020,
    day: 13,
    result: 'finished',
    status: 'solved',
    speed: 'fast',
    code: 'clean',
    difficulty: 4
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 295,
        part2: 1068781
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 3417
      }
    },
    {
      id: 'test3',
      answers: {
        part2: 754018
      }
    },
    {
      id: 'test4',
      answers: {
        part2: 779210
      }
    },
    {
      id: 'test5',
      answers: {
        part2: 1261476
      }
    },
    {
      id: 'test6',
      answers: {
        part2: 1202161486
      }
    }
  ],
  prod: {
    answers: {
      part1: 2165,
      part2: 534035653563227
    }
  }
}

export default config
