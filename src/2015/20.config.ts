export default {
  config: {
    year: '2015',
    day: '20',
    title: 'Infinite Elves and Infinite Houses',
    status: 'done',
    comment:
      "Not sure if I can optimize this, I have to generate until I find something first above threshold that I believe I can't reliably forecast",
    difficulty: 3
  },
  test: {
    id: 'test',
    params: {
      threshold: 150,
      maxHousePresents: 50,
      elfMultiplier: {
        part1: 10,
        part2: 11
      }
    },
    answers: {
      part1: 8
    }
  },
  prod: {
    params: {
      threshold: 33100000,
      maxHousePresents: 50,
      elfMultiplier: {
        part1: 10,
        part2: 11
      }
    },
    answers: {
      part1: 776160,
      part2: 786240
    }
  }
}
