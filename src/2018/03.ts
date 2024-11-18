export default {
  config: {
    year: '2018',
    day: '03',
    title: 'No Matter How You Slice It',
    status: 'done',
    comment: 'easy, but wondered if area scaled up, how would I do it',
    difficulty: 1
  },
  logLevel: 'debug',
  test: {
    id: 'test',
    params: {
      size: 10
    },
    answers: {
      part1: 4,
      part2: 3
    }
  },
  prod: {
    params: {
      size: 1000
    },
    answers: {
      part1: 117948,
      part2: 567
    }
  }
}
