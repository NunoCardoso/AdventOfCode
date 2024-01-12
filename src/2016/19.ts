export default {
  config: {
    year: '2016',
    day: '19',
    title: 'An Elephant Named Joseph',
    comment: 'Very interesting. run mode: study to see pattern vs brute force',
    status: 'done',
    difficulty: 4
  },
  logLevel: 'info',
  // mode: 'study',
  test: {
    id: 'test',
    params: {
      elves: 5
    },
    answers: {
      part1: 3,
      part2: 2
    }
  },
  prod: {
    params: {
      elves: 3018458
    },
    answers: {
      part1: 1842613,
      part2: 1424135
    }
  }
}
