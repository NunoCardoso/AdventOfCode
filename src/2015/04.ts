import aoc from 'aoc'

aoc({
  year: '2015',
  day: '04',
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
})
