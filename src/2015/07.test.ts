import { _16bitAnd, _16bitNot, _16bitOr } from './07'

describe('2015/07', function () {
  test('not', () => {
    expect(_16bitNot(3)).toEqual(65532)
    expect(~3 & 0xffff).toEqual(65532)
  })

  test('and', () => {
    expect(_16bitAnd(3, 6)).toEqual(2)
    expect(3 & 6 & 0xffff).toEqual(2)
  })

  test('or', () => {
    expect(_16bitOr(3, 6)).toEqual(7)
    expect((3 | 6) & 0xffff).toEqual(7)
  })
})
