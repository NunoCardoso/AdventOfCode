import aoc from 'aoc'

aoc({
  year: '2022',
  day: '25',
  logLevel: 'info',
  ui: {
    show: false
  },
  test: [
    {
      id: 'test1',
      params: {
        mode: 'dec2SNAFU'
      }
    },
    {
      id: 'test2',
      params: {
        mode: 'SNAFU2dec'
      }
    }
  ],
  prod: {
    part1: {
      answer: '2-00=12=21-0=01--000'
    }
  }
})
