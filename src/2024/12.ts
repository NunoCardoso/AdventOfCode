export default {
  config: {
    year: '2024',
    day: '12',
    title: 'Garden Groups',
    status: 'done',
    comment:
      'Guessed wrong part2. I thought it was how many meters of fences, but that was too simple. Good that I have PointPlus',
    difficulty: 3
  },
  logLevel: 'debug',
  test: [
    {
      id: 'test1',
      answers: {
        part1: 140,
        part2: 80
      }
    },
    {
      id: 'test2',
      answers: {
        part1: 772,
        part2: 436
      }
    },
    {
      id: 'test3',
      answers: {
        part1: 1930
      }
    },
    {
      id: 'test4',
      answers: {
        part2: 236
      }
    },
    {
      id: 'test5',
      answers: {
        part2: 368
      }
    }
  ],
  prod: {
    answers: {
      part1: 1402544,
      part2: 862486
    }
  }
}
