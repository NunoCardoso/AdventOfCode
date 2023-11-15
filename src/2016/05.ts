import aoc from 'aoc'

aoc({
  year: '2016',
  day: '05',
  logLevel: 'info',
  test: {
    skip: true,
    id: 'test',
    params: {
      secretKey: 'abc'
    },
    part1: {
      answer: '18f47a30'
    },
    part2: {
      answer: '05ace8e3'
    }
  },
  prod: {
    skip: false,
    params: {
      secretKey: 'ugkcyxxp'
    },
    part1: {
      answer: 'd4cd2ee1'
    },
    part2: {
      answer: 'f2c730e5'
    }
  }
})
