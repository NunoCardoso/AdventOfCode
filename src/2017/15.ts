export default {
  config: {
    year: '2017',
    day: '15',
    title: 'Dueling Generators',
    status: 'Done',
    comment: 'I believe it is intentionally slow, 30sec on part1, need to find a pattern to make it <1s',
    difficulty: 4
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 588,
      part2: 309
    }
  },
  params: {
    iterations: {
      part1: 40000000,
      part2: 5000000
    },
    multiples: {
      A: 4,
      B: 8
    },
    generator: {
      A: 16807,
      B: 48271
    }
  },
  prod: {
    answers: {
      part1: 594,
      part2: 328
    }
  }
}
