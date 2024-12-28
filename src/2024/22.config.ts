export default {
  config: {
    year: '2024',
    day: '22',
    title: 'Monkey Market',
    status: 'done',
    comment: 'Not hard but hard to comprehend the whole thing. Had trouble separating price from price diff from' + 'secret number, but with careful debugging, I managed.',
    difficulty: 4
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 37327623
      }
    },
    {
      id: 'test2',
      answers: {
        part2: 23
      }
    }
  ],
  prod: {
    answers: {
      part1: 18694566361,
      part2: 2100
    }
  }
}
