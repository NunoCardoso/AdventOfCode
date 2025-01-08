export default {
  config: {
    year: '2016',
    day: '20',
    title: 'Firewall Rules',
    status: 'solved',
    comment: 'Quite easy, considering it is day 20, trick is to have a mergeRange function',
    difficulty: 1
  },
  test: {
    params: {
      limit: 9
    },
    id: 'test',
    answers: {
      part1: 3,
      part2: 2
    }
  },
  prod: {
    params: {
      limit: 4294967295
    },
    answers: {
      part1: 31053880,
      part2: 117
    }
  }
}
