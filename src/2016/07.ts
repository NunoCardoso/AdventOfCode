import aoc from 'aoc'

aoc({
  year: '2016',
  day: '07',
  logLevel: 'info',
  test: [
    {
      skip: false,
      id: 'test',
      part1: {
        answer: 2
      }
    },
    {
      skip: false,
      id: 'test2',
      part2: {
        answer: 3
      }
    }
  ],
  prod: {
    part1: {
      answer: 105
    },
    part2: {
      answer: 258
    }
  }
})
