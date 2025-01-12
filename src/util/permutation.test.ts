import { permutation } from './permutation'
;('./permutation')

describe('util/permutation', () => {
  test('permutation', () => {
    expect(permutation([1, 2, 3])).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ])
  })
})
