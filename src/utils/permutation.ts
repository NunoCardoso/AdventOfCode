const permutation = <T>(array: Array<T>): Array<Array<T>> => {
  const p = (array: Array<T>, temp: Array<T>) => {
    let i, x
    if (!array.length) {
      result.push(temp)
    }
    for (i = 0; i < array.length; i++) {
      x = array.splice(i, 1)[0]
      p(array, temp.concat(x))
      array.splice(i, 0, x)
    }
  }
  const result: Array<Array<T>> = []
  p(array, [])
  return result
}

const permutationForLength = (number: number): Array<Array<number>> => {
  return permutation([...Array(number).keys()])
}

export { permutation, permutationForLength }
