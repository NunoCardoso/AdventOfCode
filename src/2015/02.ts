export default {
  config: {
    year: '2015',
    day: '02',
    title: 'I Was Told There Would Be No Math',
    status: 'done',
    comment: 'Basic functional puzzle, parsing input and doing basic math sums',
    difficulty: 1
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 58,
        part2: 34
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 43,
        part2: 14
      }
    }
  ],
  prod: {
    answers: {
      part1: 1586300,
      part2: 3737498
    }
  }
}
