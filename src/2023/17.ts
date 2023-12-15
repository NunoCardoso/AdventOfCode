import aoc from 'aoc'

aoc({
  year: '2023',
  day: '17',
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 102,
        part2: 94
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 71
      }
    }
  ],
  prod: {
    answers: {
      part1: 635,
      part2: 734
    }
  }
})
