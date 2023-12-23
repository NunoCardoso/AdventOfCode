export default {
  config: {
    year: '2015',
    day: '14',
    title: 'Reindeer Olympics',
    status: 'done',
    comment: 'The trick is to accept that multiple reindeers can be in the lead at the same time',
    difficulty: 2
  },
  test: {
    id: 'test',
    params: {
      cutoff: 1000
    },
    answers: {
      part1: 1120,
      part2: 689
    }
  },
  prod: {
    params: {
      cutoff: 2503
    },
    answers: {
      part1: 2696,
      part2: 1084
    }
  }
}
