export const greatestCommonDivisor = (a: number, b: number): number => {
  if (b === 0) return a
  return greatestCommonDivisor(b, a % b)
}

export const leastCommonMultiple = (a: number, b: number) => (a * b) / greatestCommonDivisor(a, b)
