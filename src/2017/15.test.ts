const generate = (n: number, m: number) => {
  // a is the highest order chunk.

  // n is 703, or 1010111111
  // 1010111111 is less than 16 bits, so n >> 16 is 0. a=0*m
  let a = n >> 16 //* m; // 15 + 16 bits
  // 1010111111 is 10 bits, so n >> 8 is 10 in binary, or 2. b=2*m.
  // n >> 8 cleans 8 bits from right.  & 0xff cleans bits from left.
  let b = (n >> 8) & 0xff // * m; // 8 + 16 bits
  // n & 0xff gives 191, or 10111111
  // n & 0xff cleans bits from left, keeps rightmost 8 bits.
  let c = n & 0xff //* m; // 8 + 16 bits

  // so when a number like 703 is 1010111111
  // chunks are [a][b][c], as in [][10][10111111]

  a *= m
  b *= m
  c *= m

  // chunks become [0][1000001101001110][1100001111101110011001]
  b += c >> 8
  // c >> 8 is 11000011111011, will be added to 1000001101001110
  // [0][1011010001001001][1100001111101110011001]
  c &= 0xff
  //[0][1011010001001001][10011001]
  a += b >> 8
  // [10110100][1011010001001001][10011001]
  b &= 0xff
  // [10110100][1001001][10011001]
  c += a >> 15
  // [10110100][1001001][10011001]
  a &= 0x7fff // this is % 2147483647 here
  // [10110100][1001001][10011001]

  // do it again, to make sure the remainder does not affect

  b += c >> 8
  c &= 0xff
  a += b >> 8
  b &= 0xff
  c += a >> 15
  a &= 0x7fff

  // [10110100][1001001][10011001] => 101101000100100110011001
  return (a << 16) + (b << 8) + c
}

describe('2017/15', () => {
  test('s', () => {
    // 16807 * 703 % 2147483647
    // 234234234234 % 2147483647
    expect(generate(703, 16807)).toEqual((16807 * 703) % 2147483647)
  })
})
