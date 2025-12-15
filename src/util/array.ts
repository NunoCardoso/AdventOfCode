export const intersect = <T extends any>(a: Array<T>, b: Array<T>) => {
  const setB = new Set(b)
  return [...new Set(a)].filter((x) => setB.has(x))
}

export const arraysEqual = <T extends any>(a: T[], b: T[]): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i])
