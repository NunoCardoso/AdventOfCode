export const generatePermutations = <T = number>(array: T[]): T[][] => {
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

export const generateCombinations = <T = number>(array: T[], k: number): T[][] => {
  const result: T[][] = []

  function combine(start: number, currentCombination: T[]) {
    if (currentCombination.length === k) {
      result.push([...currentCombination])
      return
    }
    for (let i = start; i < array.length; i++) {
      currentCombination.push(array[i])
      combine(i + 1, currentCombination)
      currentCombination.pop() // Backtrack
    }
  }

  combine(0, [])
  return result
}

// 205 24
export const generateCombinations2 = (array: number[], target: number): number[][] => {
  const result: number[][] = []

  function combine(start: number = 0, currentCombination: number[] = []) {
    const sum = currentCombination.reduce((a, b) => a + b, 0)
    if (sum > target) {
      return
    }
    if (sum === target) {
      result.push([...currentCombination])
      return
    }
    for (let i = start; i < array.length; i++) {
      currentCombination.push(array[i])
      combine(i + 1, currentCombination)
      currentCombination.pop() // Backtrack
    }
  }

  combine()
  return result
}
