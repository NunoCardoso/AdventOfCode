import { PuzzleConfig } from 'aoc.d'

let config: PuzzleConfig = {
  config: {
    title: 'The Ideal Stocking Stuffer',
    year: 2015,
    day: 4,
    result: 'finished',
    status: 'solved',
    speed: 'md5',
    code: 'clean',
    tags: ['MD5'],
    difficulty: 1
  },
  params: {
    firstCutoff: '00000',
    secondCutoff: '000000'
  },
  test: {
    id: 'test',
    params: {
      secretKey: 'abcdef'
    },
    answers: {
      part1: 609043
    }
  },
  prod: {
    params: {
      secretKey: 'ckczppom'
    },
    answers: {
      part1: 117946,
      part2: 3938038
    }
  }
}

export default config
