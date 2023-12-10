import aoc from 'aoc'

aoc({
  year: '2023',
  day: '10',
  ui: {
    show: true
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      skip: true,
      answers: {
        part1: 8
      }
    },
    {
      id: 'test2',
      skip: true,
      answers: {
        part2: 4
      }
    },
    {
      id: 'test3',
      skip: true,
      answers: {
        part2: 8
      }
    },
    {
      id: 'test4',
      skip: true,
      answers: {
        part2: 10
      }
    }
  ],
  prod: {
    answers: {
      part1: 6717,
      part2: 381
    }
  }
})
