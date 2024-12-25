export default {
  config: {
    year: '2024',
    day: '24',
    title: 'Crossed Wires',
    status: 'inprogress',
    comment: '',
    difficulty: 0
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        //part1: 4
      }
    },
    {
      id: 'test2',
      answers: {
        // part1: 2024
      }
    },
    {
      id: 'test3',
      answers: {
        part2: 'z00,z01,z02,z05'
      }
    }
  ],
  prod: {
    answers: {
      // part1: 43942008931358
      //part2: 0
    }
  }
}
