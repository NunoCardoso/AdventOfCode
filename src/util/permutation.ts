export const permutation = <T = number>(array: T[]): T[][] => {
  const result: T[][] = []

  const permute = (current: T[], remaining: T[]): void => {
    if (remaining.length === 0) {
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
