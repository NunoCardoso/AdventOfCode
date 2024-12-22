import { CartesianProduct, Combination, Permutation } from 'js-combinatorics'

describe('js-combinatronics', () => {
  it('Permutation', () => {
    expect(new Permutation('1234', 2).toArray()).toEqual([
      ['1', '2'],
      ['1', '3'],
      ['1', '4'],
      ['2', '1'],
      ['2', '3'],
      ['2', '4'],
      ['3', '1'],
      ['3', '2'],
      ['3', '4'],
      ['4', '1'],
      ['4', '2'],
      ['4', '3']
    ])
  })
  it('Combination', () => {
    expect(new Combination('1234', 2).toArray()).toEqual([
      ['1', '2'],
      ['1', '3'],
      ['1', '4'],
      ['2', '3'],
      ['2', '4'],
      ['3', '4']
    ])
  })
  it('CartesianProduct', () => {
    expect(new CartesianProduct(['1', '2', '3'], ['A', 'B', 'C']).toArray()).toEqual([
      ['1', 'A'],
      ['2', 'A'],
      ['3', 'A'],
      ['1', 'B'],
      ['2', 'B'],
      ['3', 'B'],
      ['1', 'C'],
      ['2', 'C'],
      ['3', 'C']
    ])
  })
})
