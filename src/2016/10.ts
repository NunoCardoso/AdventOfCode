export default {
  config: {
    year: '2016',
    day: '10',
    title: 'Balance Bots',
    status: 'done',
    comment: 'it assumes that you have all rules loaded before starting chain reaction',
    difficulty: 3
  },
  logLevel: 'info',
  test: {
    id: 'test',
    params: {
      botValues: [2, 5]
    },
    answers: {
      part1: 2,
      part2: 5 * 3 * 2
    }
  },
  prod: {
    params: {
      botValues: [17, 61]
    },
    answers: {
      part1: 147,
      part2: 55637
    }
  }
}
