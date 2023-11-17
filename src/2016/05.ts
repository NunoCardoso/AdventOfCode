import aoc from 'aoc'

aoc({
  year: '2016',
  day: '05',
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
    skip: false,
    params: {
      secretKey: 'ugkcyxxp'
    },
    answers: {
      part1: 'd4cd2ee1',
      part2: 'f2c730e5'
    }
  }
})
