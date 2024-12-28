import { evolve, produce } from './22'

describe('2024/22', () => {
  test('evolve', () => {
    let sequence = [123, 15887950, 16495136, 527345, 704524, 1553684, 12683156, 11100544, 12249484, 7753432, 5908254]
    for (var i = 0; i < sequence.length - 1; i++) {
      let number = evolve(sequence[i])
      expect(number).toEqual(sequence[i + 1])
    }
  })

  test('produce', () => {
    expect(produce(1, 2000)).toEqual(8685429)
    expect(produce(10, 2000)).toEqual(4700978)
    expect(produce(100, 2000)).toEqual(15273692)
    expect(produce(2024, 2000)).toEqual(8667524)
  })
})
