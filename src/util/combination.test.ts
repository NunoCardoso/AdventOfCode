import { combination } from './combination'

describe('util/combination', () => {
  test('combination', () => {
    expect(combination([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4]
    ])
  })
})
