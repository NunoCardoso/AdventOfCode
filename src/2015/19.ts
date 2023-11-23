import aoc from 'aoc'

aoc({
  year: '2015',
  day: '19',
  logLevel: 'info',
  ui: {
    show: true,
    during: false,
    end: true
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 4,
        part2: 3
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 7,
        part2: 6
      }
    }
  ],
  prod: {
    answers: {
      part1: 576,
      part2: 207
    }
  }
})
