import { mergeRange } from './range'

describe('util/range', () => {
  test('range', () => {
    expect(
      mergeRange(
        [
          [10, 20],
          [19, 40],
          [41, 60],
          [70, 80]
        ],
        true
      )
    ).toEqual([
      [10, 60],
      [70, 80]
    ])
    expect(
      mergeRange(
        [
          [10, 20],
          [19, 40],
          [41, 60],
          [70, 80]
        ],
        false
      )
    ).toEqual([
      [10, 40],
      [41, 60],
      [70, 80]
    ])
  })

  expect(
    mergeRange([
      [0, 3021649],
      [3021650, 3111593],
      [3111594, 3180044]
    ])
  ).toEqual([[0, 3180044]])
})
