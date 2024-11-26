export default {
  config: {
    year: '2018',
    day: '07',
    title: 'The Sum of Its Parts',
    status: 'done',
    comment: 'Really challenging but fun, not sure if combinations were useful',
    difficulty: 4
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 'CABDFE',
      part2: 15
    },
    params: {
      costPerStep: 0,
      workers: 2
    }
  },
  prod: {
    params: {
      costPerStep: 60,
      workers: 5
    },
    answers: {
      part1: 'BGJCNLQUYIFMOEZTADKSPVXRHW',
      part2: 1017
    }
  }
}
