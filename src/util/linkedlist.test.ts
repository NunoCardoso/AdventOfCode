import { LinkedList } from './linkedlist'

describe('linkedlist', () => {
  test('linkedlist', () => {
    let ll = new LinkedList()
    expect(ll.isEmpty()).toBeTruthy()

    ll.add(10)
    expect(ll.isEmpty()).toBeFalsy()

    expect(ll.length()).toEqual(1)

    ll.add(20)
    ll.add(30)
    ll.add(40)
    ll.add(50)
    expect(ll.toArray()).toEqual([10, 20, 30, 40, 50])

    expect(ll.length()).toEqual(5)
    expect(ll.removeElement(50)).toEqual(50)
    expect(ll.length()).toEqual(4)

    expect(ll.indexOf(40)).toEqual(3)

    ll.insertAt(60, 2)
    expect(ll.toArray()).toEqual([10, 20, 60, 30, 40])

    expect(ll.get(2)).toEqual(60)

    ll.removeAt(1)
    expect(ll.toArray()).toEqual([10, 60, 30, 40])
  })
})
