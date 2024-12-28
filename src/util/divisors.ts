/* an approximation is that the middle divisors are wrapping the square root value.
   so, with 30, Math.sqrt(30) is between 5 and 6, which are the middle divisors
 */
export const divisors = (n: number): number[] => {
  if (n === 1) return [1]
  const divisorList = [1]
  const otherDivisorList = [n]
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divisorList.push(i)
      if (n / i !== i) otherDivisorList.unshift(n / i)
    }
  }
  return divisorList.concat(otherDivisorList)
}
