export default {
  config: {
    year: '2018',
    day: '07',
    title: 'The Sum of Its Parts',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: 'part1',
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
    skip: true,
    params: {
      costPerStep: 60,
      workers: 5
    },
    answers: {
      part1: 'BGJCNLQUYIFMOEZTADKSPVXRHW',
      part2: 0
    }
  }
}
