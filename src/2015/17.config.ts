export default {
  config: {
    year: '2015',
    day: '17',
    title: 'No Such Thing as Too Much',
    status: 'done',
    tags: ['permutation'],
    comments: 'I like the custom permutation function so I can collect the data for answers while permutating',
    difficulty: 3
  },
  test: {
    id: 'test',
    params: {
      limit: 25
    },
    answers: {
      part1: 4,
      part2: 3
    }
  },
  prod: {
    params: {
      limit: 150
    },
    answers: {
      part1: 4372,
      part2: 4
    }
  }
}
