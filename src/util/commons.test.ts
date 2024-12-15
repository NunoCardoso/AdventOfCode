import { greatestCommonDivisor, leastCommonMultiple } from './commons'

describe('util/commons', () => {
  test('leastCommonMultiple', () => {
    expect(leastCommonMultiple(4, 6)).toEqual(12)
  })
  test('greatestCommonDivisor', () => {
    expect(leastCommonMultiple(10, 6)).toEqual(30)
  })
})
