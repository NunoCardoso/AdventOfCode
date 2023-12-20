export default {
  config: {
    year: '2016',
    day: '04',
    title: 'Security Through Obscurity'
  },
  logLevel: 'info',
  test: [
    {
      id: 'test1',
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
}
