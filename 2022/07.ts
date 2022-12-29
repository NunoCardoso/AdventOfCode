import aoc from '../aoc'

aoc({
  year: '2022',
  day: '07',
  logLevel: 'error',
  params: {
    cutoffDirSize: 100000,
    totalDiskSize: 70000000,
    minSpaceFree: 30000000
  },
  test: {
    id: 'test',
    part1: {
      answer: 95437
    },
    part2: {
      answer: 24933642
    }
  },
  prod: {
    part1: {
      answer: 1555642
    },
    part2: {
      answer: 5974547
    }
  }
})
