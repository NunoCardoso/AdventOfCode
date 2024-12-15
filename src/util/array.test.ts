import { intersect } from './array'

describe('util/array', () => {
  test('intersect', () => {
    expect(intersect([1, 2, 3, 4], [4, 5, 6, 7])).toEqual([4])
  })
})
