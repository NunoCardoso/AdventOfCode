import { doKeyboardMovesFor } from './21'

describe('2024/21 - preferrable paths', () => {
  test('<vA is SHORTER than v<A', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('<vA'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('v<A'))
    expect(newCode.length).toBeLessThan(newCode2.length)
  })

  test('<^A is SHORTER than ^<A', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('<^A'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('^<A'))
    expect(newCode.length).toBeLessThan(newCode2.length)
  })

  test('v>A is SHORTER than >vA', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('v>A'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('>vA'))
    expect(newCode.length).toBeLessThan(newCode2.length)
  })

  test('v<A is LONGER than <vA', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('v<A'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('<vA'))
    expect(newCode.length).toBeGreaterThan(newCode2.length)
  })

  test('>vA is LONGER than v>A', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('>vA'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('v>A'))
    expect(newCode.length).toBeGreaterThan(newCode2.length)
  })

  test('>^A is SAME as ^>A', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('>^A'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('^>A'))
    expect(newCode.length).toEqual(newCode2.length)
  })

  test('^<A is LONGER than <^A', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('^<A'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('<^A'))
    expect(newCode.length).toBeGreaterThan(newCode2.length)
  })

  test('^>A is SAME as >^A', () => {
    let newCode = doKeyboardMovesFor(doKeyboardMovesFor('^>A'))
    let newCode2 = doKeyboardMovesFor(doKeyboardMovesFor('>^A'))
    expect(newCode.length).toEqual(newCode2.length)
  })
})
