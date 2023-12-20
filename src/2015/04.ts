export default {
  config: {
    year: '2015',
    day: '04',
    comment: 'md5, > 2 s, nothing I can do to make it faster'
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
