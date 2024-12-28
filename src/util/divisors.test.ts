import { divisors } from './divisors'

describe('divisors', () => {
  test('divisor', () => {
    expect(divisors(1)).toEqual([1])
    expect(divisors(2)).toEqual([1, 2])
    expect(divisors(3)).toEqual([1, 3])
    expect(divisors(4)).toEqual([1, 2, 4])
    expect(divisors(5)).toEqual([1, 5])
    expect(divisors(6)).toEqual([1, 2, 3, 6])
    expect(divisors(7)).toEqual([1, 7])
    expect(divisors(8)).toEqual([1, 2, 4, 8])
    expect(divisors(9)).toEqual([1, 3, 9])
    expect(divisors(10)).toEqual([1, 2, 5, 10])
    expect(divisors(11)).toEqual([1, 11])
    expect(divisors(12)).toEqual([1, 2, 3, 4, 6, 12])
    expect(divisors(13)).toEqual([1, 13])
    expect(divisors(14)).toEqual([1, 2, 7, 14])
    expect(divisors(15)).toEqual([1, 3, 5, 15])
    expect(divisors(16)).toEqual([1, 2, 4, 8, 16])
  })
})
