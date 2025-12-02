import { Combination } from 'js-combinatorics'
import { doBronKerbosch } from './23'

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

  // https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
  test('doBronKerbosch', () => {
    let connectionSet = new Set([
      '1-2',
      '2-1',
      '1-5',
      '5-1',
      '2-5',
      '5-2',
      '2-3',
      '3-2',
      '5-4',
      '4-5',
      '3-4',
      '4-3',
      '6-4',
      '4-6'
    ])
    let P = ['2', '1', '3', '4', '5', '6']
    expect(doBronKerbosch([], P, [], connectionSet)).toEqual(['2', '1', '5'])
  })
})
