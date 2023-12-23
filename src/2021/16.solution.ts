import { Params } from 'aoc.d'

type Packet = {
  version: number
  type: number
  value?: number
  subPackets: Array<Packet>
}
export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const operations = ['+', '*', 'min', 'max', '=', '>', '<', '==']

  const hexMap: Record<number | string, string> = {
    0: '0000',
    1: '0001',
    2: '0010',
    3: '0011',
    4: '0100',
    5: '0101',
    6: '0110',
    7: '0111',
    8: '1000',
    9: '1001',
    a: '1010',
    b: '1011',
    c: '1100',
    d: '1101',
    e: '1110',
    f: '1111'
  }

  const hex2bin = (hex: string): string => {
    let bin = ''
    for (const c of hex.toLowerCase()) {
      bin += hexMap[c]
    }
    return bin
  }

  const bin2dec = (s: string): number => parseInt(parseInt(s, 2).toString(10))

  const processSinglePacket = (message: string): [string, Packet] => {
    let i = 0
    log.debug('processSinglePacket', message)

    const packet: Packet = {
      version: 0,
      type: 0,
      value: 0,
      subPackets: []
    }

    packet.version = bin2dec(message.slice(i, i + 3))
    log.debug('Version', packet.version)
    i += 3
    packet.type = bin2dec(message.slice(i, i + 3))
    i += 3
    log.debug('Type ', packet.type)

    if (packet.type === 4) {
      let bits = ''
      let lastOne = false
      while (!lastOne) {
        const bit = message.slice(i, i + 5)
        if (bit.length === 5) {
          bits += bit.slice(1, 5)
        }
        i += 5
        if (bit[0] === '0') {
          lastOne = true
        }
      }
      packet.value = bin2dec(bits)
      log.debug('Type 4, literal value', packet.value)

      return [message.substring(i, message.length), packet]
    }

    const lengthTypeID = parseInt(message.slice(i, i + 1))
    i++

    if (lengthTypeID === 0) {
      const packetLength = bin2dec(message.slice(i, i + 15))
      i += 15
      log.debug('lengthTypeID', lengthTypeID, 'length', packetLength, 'given from 15 bits')
      log.debug('packetLength, reading next ', packetLength, 'bits')
      const submessage = message.slice(i, i + packetLength)
      i += packetLength
      packet.subPackets = processPackets(submessage)
    } else if (lengthTypeID === 1) {
      const packetCount = bin2dec(message.slice(i, i + 11))
      i += 11
      log.debug('lengthTypeID', lengthTypeID, 'count', packetCount, 'given from 11 bits')
      log.debug('packetCount, reading next', packetCount, 'packets')
      let submessage = message.substring(i, message.length)

      for (let j = 0; j < packetCount; j++) {
        const [restMessage, _p] = processSinglePacket(submessage)
        packet.subPackets.push(_p)
        const processedBits = submessage.length - restMessage.length
        i += processedBits
        log.debug('packetCount: processed #', j, 'processedBits', processedBits)
        submessage = restMessage
      }
    }

    return [message.substring(i, message.length), packet]
  }

  const processPackets = (message: string): Array<Packet> => {
    let m = message
    const packets: Array<Packet> = []
    while (m.length > 7) {
      const [__m, packet] = processSinglePacket(m)
      m = __m
      packets.push(packet)
    }
    // log.info('No more message, or message too short', m)
    return packets
  }

  for await (const line of lineReader) {
    const packets: Array<Packet> = processPackets(hex2bin(line))

    const printPacket = (p: Packet, depth: number) => {
      log.debug(' '.repeat(depth) + '└', operations[p.type], p.type === 4 ? p.value : '-')
      p.subPackets.forEach((_p) => {
        printPacket(_p, depth + 1)
      })
    }

    packets.forEach((p) => printPacket(p, 0))

    const sumPacketVersions = (p: Packet): number => {
      return p.version + p.subPackets?.reduce((x, y) => x + sumPacketVersions(y), 0)
    }

    const sumPacketOperators = (p: Packet, depth: number): number => {
      let val

      switch (p.type) {
        case 0:
          val = p.subPackets?.reduce((x, y) => x + sumPacketOperators(y, depth + 1), 0) ?? 0
          log.debug(
            '  '.repeat(depth),
            'Doing + with',
            p.subPackets.map((x) => x.value).join(','),
            'gives',
            val
          )
          return val
        case 1:
          val = p.subPackets?.reduce((x, y) => x * sumPacketOperators(y, depth + 1), 1) ?? 0
          log.debug(
            '  '.repeat(depth),
            'Doing * with',
            p.subPackets.map((x) => x.value).join(','),
            'gives',
            val
          )
          return val
        case 2:
          val = Math.min(...p.subPackets?.map((x) => sumPacketOperators(x, depth + 1)))
          log.debug(
            '  '.repeat(depth),
            'Doing min with',
            p.subPackets.map((x) => x.value).join(','),
            'gives',
            val
          )
          return val
        case 3:
          val = Math.max(...p.subPackets?.map((x) => sumPacketOperators(x, depth + 1)))
          log.debug(
            '  '.repeat(depth),
            'Doing max with',
            p.subPackets.map((x) => x.value).join(','),
            'gives',
            val
          )
          return val
        case 4:
          val = p.value ?? 0
          log.debug('  '.repeat(depth), 'returning ', val)
          return val
        case 5:
          // @ts-ignore
          val =
            sumPacketOperators(p.subPackets[0], depth + 1) > sumPacketOperators(p.subPackets[1], depth + 1)
              ? 1
              : 0
          log.debug(
            '  '.repeat(depth),
            'Doing > with',
            p.subPackets.map((x) => x.value).join(','),
            'gives',
            val
          )
          return val
        case 6:
          // @ts-ignore
          val =
            sumPacketOperators(p.subPackets[0], depth + 1) < sumPacketOperators(p.subPackets[1], depth + 1)
              ? 1
              : 0
          log.debug(
            '  '.repeat(depth),
            'Doing < with ',
            p.subPackets.map((x) => x.value).join(','),
            'gives',
            val
          )
          return val
        case 7:
          // @ts-ignore
          val =
            sumPacketOperators(p.subPackets[0], depth + 1) === sumPacketOperators(p.subPackets[1], depth + 1)
              ? 1
              : 0
          log.debug(
            '  '.repeat(depth),
            'Doing == with',
            p.subPackets.map((x) => x.value).join(','),
            'gives',
            val
          )
          return val
      }
      return 0
    }

    part1 = packets.reduce((x, y) => x + sumPacketVersions(y), 0)

    part2 = packets.reduce((x, y) => x + sumPacketOperators(y, 0), 0)
  }

  return { part1, part2 }
}
