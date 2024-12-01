//Useful Functions
export const checkBin = (n: any) => {
  return /^[01]{1,64}$/.test(n)
}
export const checkDec = (n: any) => {
  return /^[0-9]{1,64}$/.test(n)
}
export const checkHex = (n: any) => {
  return /^[0-9A-Fa-f]{1,64}$/.test(n)
}
export const pad = (s: any, z: any): any => {
  s = '' + s
  return s.length < z ? pad('0' + s, z) : s
}

export const unpad = (s: any) => {
  s = '' + s
  return s.replace(/^0+/, '')
}

//Decimal operations
export const Dec2Bin = (n: any) => {
  if (!checkDec(n) || n < 0) return 0
  return n.toString(2)
}
export const Dec2Hex = (n: any) => {
  if (!checkDec(n) || n < 0) return 0
  return n.toString(16)
}

//Binary Operations
export const Bin2Dec = (n: any) => {
  if (!checkBin(n)) return 0
  return parseInt(n, 2).toString(10)
}
export const Bin2Hex = (n: any) => {
  if (!checkBin(n)) return 0
  return parseInt(n, 2).toString(16)
}

//Hexadecimal Operations
export const Hex2Bin = (n: any) => {
  if (!checkHex(n)) return 0
  return parseInt(n, 16).toString(2)
}
export const Hex2Dec = (n: any) => {
  if (!checkHex(n)) return 0
  return parseInt(n, 16).toString(10)
}
