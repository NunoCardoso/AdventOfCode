export default {
  config: {
    year: '2024',
    day: '05',
    title: 'Print queue',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    answers: {
      part1: 143,
      part2: 123
    }
  },
  prod: {
    skip: 'part1',
    answers: {
      part1: 5713,
      part2: 5180
    }
  }
}
