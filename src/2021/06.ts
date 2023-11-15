import aoc from 'aoc'

aoc({
  year: '2021',
  day: '06',
  params: {
    part1: {
      days: 80
    },
    part2: {
      days: 256
    }
  },

  test: {
    id: 'test',
    part1: {
      answer: 5934
    },
    part2: {
      answer: 26984457539
    }
  },
  prod: {
    part1: {
      answer: 360761
    },
    part2: {
      answer: 1632779838045
    }
  }
})
