import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'Scrambled Letters and Hash',
    year: 2016,
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
      password: {
        part1: 'abcde',
        part2: 'decab'
      }
    },
    answers: {
      part1: 'decab',
      part2: 'abcde'
    }
  },
  prod: {
    params: {
      password: {
        part1: 'abcdefgh',
        part2: 'fbgdceah'
      }
    },
    answers: {
      part1: 'cbeghdaf',
      part2: 'bacdefgh'
    }
  }
}
export default config
