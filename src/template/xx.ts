export default {
  config: {
    year: '{{year}}',
    day: '{{day}}',
    title: '',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    skip: 'part2',
    answers: {
      part1: 0,
      part2: 0
    }
  },
  prod: {
    skip: true,
    answers: {
      part1: 0,
      part2: 0
    }
  }
}
