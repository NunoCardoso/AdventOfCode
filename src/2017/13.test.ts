import { getPosition } from './13'

describe('2017/13', () => {
  test('getPosition', () => {
    expect(getPosition(4, 0)).toBe(0)
    expect(getPosition(4, 1)).toBe(1)
    expect(getPosition(4, 2)).toBe(2)
    expect(getPosition(4, 3)).toBe(3)
    expect(getPosition(4, 4)).toBe(2)
    expect(getPosition(4, 5)).toBe(1)
    expect(getPosition(4, 6)).toBe(0)
    expect(getPosition(4, 7)).toBe(1)
  })
})
