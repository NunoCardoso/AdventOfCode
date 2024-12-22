export default {
  config: {
    year: '2024',
    day: '21',
    title: 'Keypad Conundrum',
    status: 'done',
    comment:
      'So far, the best puzzle of the show. See readme for a comprehensive detail. It was really intuitive that ' +
      'some keypad paths were faster, but not obvious for the keyboard. A bit difficult to cache and optimize, but really ' +
      'good stuff',
    difficulty: 5
  },
  logLevel: 'info',
  test: {
    id: 'test',
    answers: {
      part1: 126384
    }
  },
  params: {
    robots: {
      part1: 2,
      part2: 25
    }
  },
  prod: {
    answers: {
      part1: 105458,
      part2: 129551515895690
    }
  }
}
