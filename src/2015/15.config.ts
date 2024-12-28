export default {
  config: {
    year: '2015',
    day: '15',
    title: 'Science for Hungry People',
    status: 'done',
    comment: 'not happy with the code for portion calculation but it works',
    difficulty: 3
  },
  params: {
    calories: {
      part1: undefined,
      part2: 500
    }
  },
  test: {
    id: 'test',
    answers: {
      part1: 62842880,
      part2: 57600000
    }
  },
  prod: {
    answers: {
      part1: 18965440,
      part2: 15862900
    }
  }
}
