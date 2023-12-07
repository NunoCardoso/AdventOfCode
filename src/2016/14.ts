import aoc from 'aoc'

aoc({
  year: '2016',
  day: '14',
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      salt: 'abc',
      cutoff: 64,
      viewAhead: 1000,
      repetition: 2016
    },
    answers: {
      part1: 22728,
      part2: 22551
    }
  },
  prod: {
    params: {
      salt: 'yjdafjpo',
      cutoff: 64,
      viewAhead: 1000,
      repetition: 2016
    },
    answers: {
      part1: 25427,
      part2: 22045
    }
  }
})
