import { Combination } from 'js-combinatorics'

describe('2024/23', () => {
  test('combinations', () => {
    expect(new Combination(['ab', 'cd', 'ef', 'gh'], 2).toArray()).toEqual([
      ['ab', 'cd'],
      ['ab', 'ef'],
      ['ab', 'gh'],
      ['cd', 'ef'],
      ['cd', 'gh'],
      ['ef', 'gh']
    ])
  })
})
