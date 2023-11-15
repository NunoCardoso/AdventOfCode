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
    part1: {
      answer: 609043
    }
  },
  prod: {
    params: {
      secretKey: 'ckczppom'
    },
    part1: {
      answer: 117946
    },
    part2: {
      answer: 3938038
    }
  }
})
