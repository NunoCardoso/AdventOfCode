export default {
  config: {
    year: '2024',
    day: '15',
    title: 'Warehouse Woes',
    status: 'done',
    comment: 'Hard part2. I only got it as I sorted the paths. A lot of simplifications can be done',
    difficulty: 4
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 2028
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 10092,
        part2: 9021
      }
    },
    {
      id: 'test3',
      answers: {
        //part2: 0
      }
    }
  ],
  ui: {
    show: false,
    keypress: false
  },
  prod: {
    answers: {
      part1: 1527563,
      part2: 1521635
    }
  }
}
