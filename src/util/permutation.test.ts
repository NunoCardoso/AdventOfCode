import { generateCombinations, generateCombinations2, generatePermutations } from './permutation'

;('./permutation')

describe('util/permutation', () => {
  test('permutation', () => {
    expect(generatePermutations([1, 2, 3])).toEqual([
      [1, 2, 3],
      [1, 3, 2],
      [2, 1, 3],
      [2, 3, 1],
      [3, 1, 2],
      [3, 2, 1]
    ])
  })

  test('combination', () => {
    expect(generateCombinations([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4]
    ])
  })

  test('combination2', () => {
    expect(generateCombinations2([1, 2, 3, 4, 5, 7, 8, 9, 10, 11], 20)).toEqual([
      [1, 2, 3, 4, 10],
      [1, 2, 3, 5, 9],
      [1, 2, 4, 5, 8],
      [1, 2, 7, 10],
      [1, 2, 8, 9],
      [1, 3, 4, 5, 7],
      [1, 3, 5, 11],
      [1, 3, 7, 9],
      [1, 4, 5, 10],
      [1, 4, 7, 8],
      [1, 8, 11],
      [1, 9, 10],
      [2, 3, 4, 11],
      [2, 3, 5, 10],
      [2, 3, 7, 8],
      [2, 4, 5, 9],
      [2, 7, 11],
      [2, 8, 10],
      [3, 4, 5, 8],
      [3, 7, 10],
      [3, 8, 9],
      [4, 5, 11],
      [4, 7, 9],
      [5, 7, 8],
      [9, 11]
    ])
  })
})
