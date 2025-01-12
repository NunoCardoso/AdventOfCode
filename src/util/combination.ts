export const combination = <T = number>(array: T[], k: number): T[][] => {
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
