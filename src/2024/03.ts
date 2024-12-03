export default {
  config: {
    year: '2024',
    day: '03',
    title: 'Mull It Over',
    status: 'done',
    comment: 'nice that I still remember OR regexes',
    difficulty: 1
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test',
      answers: {
        part1: 161
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 48
      }
    }
  ],
  prod: {
    skip: 'part1',
    answers: {
      part1: 178538786,
      part2: 102467299
    }
  }
}
