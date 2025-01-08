import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    year: 2016,
    day: 5,
    title: 'How About a Nice Game of Chess?',
    result: 'finished',
    status: 'solved',
    speed: 'md5',
    code: 'clean',
    difficulty: 2,
    tags: ['MD5']
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      secretKey: 'abc'
    },
    answers: {
      part1: '18f47a30',
      part2: '05ace8e3'
    }
  },
  prod: {
    params: {
      secretKey: 'ugkcyxxp'
    },
    answers: {
      part1: 'd4cd2ee1',
      part2: 'f2c730e5'
    }
  }
}

export default config
