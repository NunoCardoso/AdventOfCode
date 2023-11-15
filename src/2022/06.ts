import aoc from 'aoc'

aoc({
  year: '2022',
  day: '06',
  params: {
    part1: {
      length: 4
    },
    part2: {
      length: 14
    }
  },
  test: [
    {
      id: 'test1',
      part1: { answer: 7 },
      part2: { answer: 19 }
    },
    {
      id: 'test2',
      part1: { answer: 5 },
      part2: { answer: 23 }
    },
    {
      id: 'test3',
      part1: { answer: 6 },
      part2: { answer: 23 }
    },
    {
      id: 'test4',
      part1: { answer: 10 },
      part2: { answer: 29 }
    },
    {
      id: 'test5',
      part1: { answer: 11 },
      part2: { answer: 26 }
    }
  ],
  prod: {
    part1: {
      answer: 1953
    },
    part2: {
      answer: 2301
    }
  }
})
