export default {
  config: {
    year: '2015',
    day: '18',
    title: 'Like a GIF For Your Yard',
    status: 'done',
    comment: 'Mapping changes in a grid and iterating until the final state exists',
    difficulty: 3
  },
  ui: {
    show: true,
    during: false,
    end: true
  },
  test: [
    {
      id: 'test1',
      params: {
        limit: 4
      },
      answers: {
        part1: 4
      }
    },
    {
      id: 'test2',
      params: {
        limit: 5
      },
      answers: {
        part2: 17
      }
    }
  ],
  prod: {
    params: {
      limit: 100
    },
    answers: {
      part1: 768,
      part2: 781
    }
  }
}
