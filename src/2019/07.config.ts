import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Amplification Circuit',
    year: 2019,
    day: 7,
    result: 'unfinished',
    status: 'solved',
    speed: 'fast',
    code: 'dirty',
    difficulty: 0
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        //part1: 43210
        //part2: 0
      }
    },
    {
      id: 'test2',
      answers: {
        // part1: 54321
        //part2: 0
      }
    },
    {
      id: 'test3',
      answers: {
        //  part1: 65210
        //part2: 0
      }
    }
  ],
  prod: {
    answers: {
      part1: 118936
      //part2: 0
    }
  }
}

export default config
