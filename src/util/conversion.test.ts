import { bin2dec, bin2hex, dec2bin, dec2hex, hex2bin, hex2dec } from './conversion'

describe('util/conversion', () => {
  test('dec2bin', () => {
    expect(dec2bin(15)).toEqual('1111')
  })
  test('dec2bin', () => {
    expect(dec2hex(15)).toEqual('f')
  })
  test('bin2dec', () => {
    expect(bin2dec('1111')).toEqual(15)
  })
  test('bin2hex', () => {
    expect(bin2hex('1111')).toEqual('f')
  })
  test('hex2bin', () => {
    expect(hex2bin('f')).toEqual('1111')
  })
  test('hex2dec', () => {
    expect(hex2dec('f')).toEqual(15)
  })
})
