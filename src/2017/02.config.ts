export default {
  config: {
    year: '2017',
    day: '02',
    title: 'Corruption Checksum',
    status: 'done',
    comment: 'Making sums while parsing input',
    difficulty: 1
  },
  test: [
    {
      id: 'test1',
      answers: {
        part1: 18
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 9
      }
    }
  ],
  prod: {
    answers: {
      part1: 47136,
      part2: 250
    }
  }
}
