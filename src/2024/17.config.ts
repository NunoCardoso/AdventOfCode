import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2024,
    day: 17,
    title: 'Chronospatial Computer',
    result: 'unfinished',
    status: 'unsolved',
    speed: 'slow',
    code: 'dirty',
    comment: 'see readme for the ride',
    difficulty: 5
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: '4,6,3,5,6,3,5,2,1,0'
      }
    },
    {
      id: 'test2',
      answers: {
        //    part2: 117440
      }
    }
  ],
  prod: {
    answers: {
      part1: '7,0,7,3,4,1,3,0,1',
      part2: 156985331222018
    }
  }
}

export default config
