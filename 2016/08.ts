import aoc from '../aoc'

aoc({
  year: '2016',
  day: '08',
  logLevel: 'info',
  ui: { show: true, during: true },
  params: {
    screenSize: {
      test: {
        height: 3,
        width: 7
      },
      prod: {
        height: 6,
        width: 50
      }
    }
  },
  test: {
    id: 'test',
    part1: {
      answer: 6
    },
    part2: {
      answer: 2
    }
  },
  prod: {
    part1: {
      answer: 119
    },
    part2: {
      answer: 'ZFHFSFOGPO'
    }
  }
})
