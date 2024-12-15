//Utility functions for conversion

export const dec2bin = (n: number): string => n.toString(2)

export const dec2hex = (n: number): string => n.toString(16)

export const bin2dec = (n: string): number => parseInt(n, 2)

export const bin2hex = (n: string): string => parseInt(n, 2).toString(16)

export const hex2bin = (n: string): string => parseInt(n, 16).toString(2)
export const hex2dec = (n: string): number => parseInt(n, 16)
