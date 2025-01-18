import { QueueLinkedList } from './queuelist'

describe('QueueLinkedList', () => {
  test('QueueLinkedList', () => {
    let qll = new QueueLinkedList<number>()

    /** isEmpty **/
    expect(qll.isEmpty()).toBeTruthy()
    expect(qll.length()).toEqual(0)
    expect(qll.toArray()).toEqual([])
    expect(qll.pop()).toEqual(null)
    expect(qll.get('key')).toEqual(null)
    expect(qll.remove('key')).toEqual(null)

    /** add **/

    qll.add(1, 10)
    expect(qll.isEmpty()).toBeFalsy()

    /** length **/
    expect(qll.length()).toEqual(1)

    qll.add(2, 20)
    qll.add(3, 30)
    qll.add(4, 40)
    qll.add(5, 50)

    // lowest sort score goes to the right
    expect(qll.toArray()).toEqual([5, 4, 3, 2, 1])

    expect(qll.length()).toEqual(5)

    /** pop **/
    expect(qll.pop()).toEqual(1)
    expect(qll.length()).toEqual(4)

    /** get **/
    expect(qll.get('3')).toEqual(3)
    expect(qll.getSort('3')).toEqual(30)

    qll.add(0.5, 5)
    qll.add(2.5, 25)
    qll.add(5.5, 55)
    expect(qll.toArray()).toEqual([5.5, 5, 4, 3, 2.5, 2, 0.5])

    /** remove **/
    let val = qll.remove('4')
    expect(val).toEqual(4)
    expect(qll.toArray()).toEqual([5.5, 5, 3, 2.5, 2, 0.5])

    /** when it has the same sorting **/
    qll.add(3.1, 30)
    qll.add(2.9, 30)
    expect(qll.toArray()).toEqual([5.5, 5, 3, 3.1, 2.9, 2.5, 2, 0.5])

    qll.remove('5')
    expect(qll.toArray()).toEqual([5.5, 3, 3.1, 2.9, 2.5, 2, 0.5])
  })
})
