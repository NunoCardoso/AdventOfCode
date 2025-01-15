class Node<T> {
  element: T
  next: Node<T> | null
  constructor(element: T) {
    this.element = element
    this.next = null
  }
}

export class LinkedList<T> {
  head: Node<T> | null
  size: number
  cursor: number | null
  constructor() {
    this.head = null
    this.size = 0
    this.cursor = null
  }

  add(element: T) {
    // creates a new node
    let node = new Node<T>(element)
    // to store current node
    let current
    // if list is Empty add the element and make it head
    if (this.head == null) {
      this.head = node
      this.cursor = 0
    } else {
      current = this.head
      // iterate to the end of thelist
      while (current.next) {
        current = current.next
      }
      // add node
      current.next = node
    }
    this.size++
  }

  insertAt(element: T, index: number) {
    if (index < 0 || index > this.size) return console.log('Please enter a valid index.')
    else {
      // creates a new node
      let node = new Node(element)
      let curr, prev

      curr = this.head

      // add the element to the
      // first index
      if (index == 0) {
        node.next = this.head
        this.head = node
      } else {
        curr = this.head
        let it = 0

        // iterate over the list to find
        // the position to insert
        while (it < index) {
          it++
          prev = curr
          curr = curr?.next
        }

        // adding an element
        node.next = curr!
        prev!.next = node
      }
      this.size++
    }
  }

  removeAt(index: number) {
    if (index < 0 || index >= this.size) return console.log('Please Enter a valid index')
    else {
      let curr,
        prev,
        it = 0
      curr = this.head
      prev = curr

      // deleting first element
      if (index === 0) {
        this.head = curr!.next
      } else {
        // iterate over the list to the
        // position to remove an element
        while (it < index) {
          it++
          prev = curr
          curr = curr!.next
        }

        // remove the element
        prev!.next = curr!.next
      }
      this.size--

      // return the remove element
      return curr!.element
    }
  }
  removeElement(element: T) {
    let current = this.head
    let prev = null

    // iterate over the list
    while (current != null) {
      // comparing element with current
      // element if found then remove the
      // and return true
      if (current.element === element) {
        if (prev == null) {
          this.head = current.next
        } else {
          prev.next = current.next
        }
        this.size--
        return current.element
      }
      prev = current
      current = current.next
    }
    return -1
  }
  indexOf(element: T) {
    let count = 0
    let current = this.head

    // iterate over the list
    while (current != null) {
      // compare each element of the list
      // with given element
      if (current.element === element) return count
      count++
      current = current.next
    }

    // not found
    return -1
  }

  get(index: T) {
    let i = 0
    let current = this.head
    // iterate over the list
    while (i++ != index) {
      current = current!.next
    }
    return current?.element
  }

  isEmpty() {
    return this.size == 0
  }
  length() {
    return this.size
  }
  // prints the list items
  toArray() {
    let curr = this.head
    let arr = []
    while (curr) {
      arr.push(curr.element)
      curr = curr.next
    }
    return arr
  }
}
