import { findEqualSumGroups } from './24.fastest'

describe('2015/24', () => {
  test('findEqualSumGroups', () => {
    expect(findEqualSumGroups([1, 2, 3, 4, 5, 7, 8, 9, 10, 11], 4)).toEqual([
      [
        [
          [1, 2, 3, 9],
          [4, 11],
          [5, 10],
          [7, 8]
        ],
        [
          [1, 3, 11],
          [2, 4, 9],
          [5, 10],
          [7, 8]
        ],
        [
          [1, 5, 9],
          [2, 3, 10],
          [4, 11],
          [7, 8]
        ]
      ]
    ])
  })
})
