export default {
  config: {
    year: '2016',
    day: '18'
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
      params: {
        rows: {
          part1: 3
        }
      },
      answers: {
        part1: 6
      }
    },
    {
      id: 'test2',
      params: {
        rows: {
          part1: 10
        }
      },
      answers: {
        part1: 38
      }
    }
  ],
  prod: {
    params: {
      rows: {
        part1: 40,
        part2: 400000
      }
    },
    answers: {
      part1: 1963,
      part2: 20009568
    }
  }
}
