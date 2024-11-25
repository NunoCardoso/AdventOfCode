export default {
  config: {
    year: '2018',
    day: '05',
    title: 'Alchemical Reduction',
    status: 'done',
    comment: 'string too big for recursion, smart',
    difficulty: 2
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 10,
      part2: 4
    }
  },
  prod: {
    skip: 'part1',
    answers: {
      part1: 9704,
      part2: 6942
    }
  }
}
