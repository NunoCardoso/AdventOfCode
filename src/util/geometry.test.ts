import { lineIntersect } from './geometry'

describe('util/geometry', () => {
  test('lineIntersect', () => {
    expect(
      lineIntersect(
        [
          [3, 3],
          [17, 8]
        ],
        [
          [7, 10],
          [11, 2]
        ]
      )
    ).toEqual([9.363636363636363, 5.2727272727272725])
    expect(
      lineIntersect(
        [
          [13, 9],
          [27, 9]
        ],
        [
          [26, 6],
          [26, 14]
        ]
      )
    ).toEqual([26, 9])
  })
})
