export const permutation = <T = number>(array: T[], maxSize?: number): T[][] => {
  const result: T[][] = []
  const size = maxSize ?? array.length
  const used: boolean[] = new Array(array.length).fill(false)
  const current: T[] = []

  const backtrack = () => {
    if (current.length === size) {
      result.push([...current])
      return
    }
    for (let i = 0; i < array.length; i++) {
      if (used[i]) continue
      used[i] = true
      current.push(array[i])
      backtrack()
      current.pop()
      used[i] = false
    }
  }

  backtrack()
  return result
}

export const permutationWithRepetition = <T = number>(array: T[], size: number): T[][] => {
  return Array(size)
    .fill(array)
    .reduce<T[][]>((acc, curr) => acc.flatMap((perm) => curr.map((item: T) => [...perm, item])), [[]])
}
