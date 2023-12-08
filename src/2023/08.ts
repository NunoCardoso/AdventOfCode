import aoc from 'aoc'

aoc({
  year: '2023',
  day: '08',
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      skip: true,
      answers: {
        part1: 2
      }
    },
    {
      id: 'test2',
      skip: true,
      answers: {
        part1: 6
      }
    },
    {
      id: 'test3',
      skip: true,
      answers: {
        part2: 6
      }
    }
  ],
  prod: {
    answers: {
      part1: 21389,
      part2: 21083806112641
    }
  }
})
