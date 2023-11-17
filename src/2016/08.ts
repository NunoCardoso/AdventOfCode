import aoc from 'aoc'

aoc({
  year: '2016',
  day: '08',
  logLevel: 'info',
  ui: { show: true, during: true },
  test: {
    id: 'test',
    params: {
      screenSize: {
        height: 3,
        width: 7
      }
    },
    answers: {
      part1: 6
    }
  },
  prod: {
    params: {
      screenSize: {
        height: 6,
        width: 50
      }
    },
    answers: {
      part1: 119,
      part2: 'ZFHFSFOGPO'
    }
  }
})
