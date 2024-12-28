import { getPatternForIndex, setPatternForIndex } from './12'

describe('2018/12', () => {
  it('getPatternForIndex', () => {
    expect(getPatternForIndex(0, ['#', '#', '#', '#', '#'])).toEqual(['.', '.', '#', '#', '#'])
    expect(getPatternForIndex(4, ['#', '#', '#', '#', '#'])).toEqual(['#', '#', '#', '.', '.'])
    expect(getPatternForIndex(-2, ['#', '#', '#', '#', '#'])).toEqual(['.', '.', '.', '.', '#'])
  })

  it('setPatternForIndex', () => {
    let _current = ['#', '#', '#', '#', '#']
    let _negative: string[] = []
    setPatternForIndex(0, 'a', _current, _negative)
    expect(_current).toEqual(['a', '#', '#', '#', '#'])
    expect(_negative).toEqual([])
    setPatternForIndex(-2, 'a', _current, _negative)
    expect(_current).toEqual(['a', '#', '#', '#', '#'])
    expect(_negative).toEqual([undefined, undefined, 'a'])
  })
})
