/** queue list is a constantly sorted list that serves the purpose of
 * storing open paths during path finding, where paths are always sorted
 * by most promising. They leave the list by popping them, they are
 * added in a sorted place, and they can be removed in the middle
 */

type Node<T> = {
  element: T // the actual element
  sort: number // the value where sorting should be done
  prevKey: string | null // the previous linked element
  nextKey: string | null // the next linked element
}

export class QueueLinkedList<T> {
  lastKey: string | null // the key for the last element
  map: Record<string, Node<T>> // the whole structure
  size: number
  constructor() {
    this.map = {}
    this.lastKey = null
    this.size = 0
  }

  // sort: smaller number ==> to the right, first to pop.
  add(element: T, newSort: number, newKey?: string) {
    if (!newKey) newKey = '' + element
    if (this.lastKey == null) {
      this.map[newKey] = { element, sort: newSort, prevKey: null, nextKey: null }
      this.lastKey = newKey
    } else {
      let currentElement: Node<T> | null = this.map[this.lastKey]
      // better, go to the right
      if (currentElement?.sort >= newSort) {
        this.map[this.lastKey].nextKey = newKey
        this.map[newKey] = { element, sort: newSort, prevKey: this.lastKey, nextKey: null }
        this.lastKey = newKey
      } else {
        let rightElement: Node<T> = currentElement
        let rightElementKey: string | null = this.lastKey
        let leftElementKey: string | null = rightElement.prevKey
        let leftElement: Node<T> | null = leftElementKey ? this.map[leftElementKey] : null

        // current element is either null (all elements have better sort value), or
        // the first one with a worse sort value.
        while (!!leftElement && leftElement.sort < newSort) {
          rightElement = leftElement
          rightElementKey = leftElementKey
          leftElementKey = leftElement.prevKey
          leftElement = leftElement.prevKey ? this.map[leftElement.prevKey] : null
        }
        if (leftElement === null) {
          // just add it to the left of prevElement
          this.map[newKey] = { element, sort: newSort, prevKey: null, nextKey: rightElementKey }
          this.map[rightElementKey!].prevKey = newKey
        } else {
          this.map[newKey] = { element, sort: newSort, prevKey: leftElementKey, nextKey: rightElementKey }
          this.map[rightElementKey!].prevKey = newKey
          this.map[leftElementKey!].nextKey = newKey
        }
      }
    }
    this.size++
  }

  has(key: string): boolean {
    return !!this.map[key]
  }

  get(key: string): T | null {
    return this.map[key]?.element ?? null
  }

  getSort(key: string): number | null {
    return this.map[key]?.sort ?? null
  }

  pop(): T | null {
    if (this.lastKey === null) return null
    let elementToReturn = this.map[this.lastKey]
    delete this.map[this.lastKey]
    this.size--
    this.lastKey = elementToReturn.prevKey
    return elementToReturn.element
  }

  remove(key: string): T | null {
    if (this.lastKey === null) return null
    if (this.lastKey === key) {
      this.pop()
    } else {
      let rightElement: Node<T> = this.map[this.lastKey]
      let rightElementKey: string | null = this.lastKey
      let currentElement: Node<T> | null = rightElement.prevKey ? this.map[rightElement.prevKey] : null
      let currentElementKey: string | null = rightElement.prevKey
      while (!!currentElement && currentElementKey !== key) {
        rightElement = currentElement
        rightElementKey = currentElementKey
        currentElementKey = currentElement.prevKey
        currentElement = currentElement.prevKey ? this.map[currentElement.prevKey] : null
      }
      if (currentElement === null) {
        return null
      } else {
        delete this.map[currentElementKey!]
        this.size--
        let leftElementKey = currentElement.prevKey
        if (leftElementKey) {
          this.map[leftElementKey!].nextKey = rightElementKey
          this.map[rightElementKey!].prevKey = leftElementKey
        } else {
          this.map[rightElementKey!].prevKey = null
        }
        return currentElement.element
      }
    }
    return null
  }

  length(): number {
    return this.size
  }

  isEmpty(): boolean {
    return this.size === 0
  }

  toArray(): T[] {
    let arr: T[] = []
    let cursor: string | null = this.lastKey
    if (!cursor) return arr
    do {
      let node: Node<T> = this.map[cursor!]!
      arr.unshift(node.element)
      cursor = node.prevKey
    } while (!!cursor)
    return arr
  }
}
