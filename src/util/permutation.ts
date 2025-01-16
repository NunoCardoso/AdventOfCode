export const permutation = <T = number>(array: T[], maxSize?: number): T[][] => {
  const result: T[][] = []
  let size = maxSize ?? array.length

  const permute = (current: T[], remaining: T[]): void => {
    if (current.length === size) {
      result.push([...current]) // Add the current permutation to the result
    } else {
      for (let i = 0; i < remaining.length; i++) {
        const next = remaining[i]
        const newRemaining = remaining.slice(0, i).concat(remaining.slice(i + 1))
        permute([...current, next], newRemaining)
      }
    }
  }

  permute([], array)
  return result
}
