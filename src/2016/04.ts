import aoc from 'aoc'

aoc({
  year: '2016',
  day: '04',
  logLevel: 'info',
  test: [
    {
      id: 'test',
      params: {
        needle: 'very encrypted name'
      },
      answers: {
        part1: 1514
      }
    },
    {
      id: 'test2',
      params: {
        needle: 'very encrypted name'
      },
      answers: {
        part2: 343
      }
    }
  ],
  prod: {
    params: {
      needle: 'northpole object storage'
    },
    answers: {
      part1: 361724,
      part2: 482
    }
  }
})
