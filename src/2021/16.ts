import { Params } from 'aoc.d'
import { range } from 'util/range'
import { bin2dec, hex2bin } from '../util/conversion'

type Packet = {
  version: number
  type: number
  value?: number
  subPackets: Packet[]
}

export default async (lineReader: any, params: Params) => {
  const log = require('console-log-level')({ level: params.logLevel ?? 'info' })

  let part1: number = 0
  let part2: number = 0

  const processSinglePacket = (message: string, packets: Packet[]): string => {
    let cursor = 0
    const packet: Packet = {
      version: 0,
      type: 0,
      value: 0,
      subPackets: []
    }
    packet.version = bin2dec(message.slice(cursor, cursor + 3))
    cursor += 3
    packet.type = bin2dec(message.slice(cursor, cursor + 3))
    cursor += 3
    if (packet.type === 4) {
      let bits = ''
      while (true) {
        const bit = message.slice(cursor, cursor + 5)
        if (bit.length === 5) bits += bit.slice(1, 5)
        cursor += 5
        if (bit[0] === '0') break
      }
      packet.value = bin2dec(bits)
      packets.push(packet)
      return message.substring(cursor, message.length)
    }
    const lengthTypeID = parseInt(message.slice(cursor, cursor + 1))
    cursor++
    if (lengthTypeID === 0) {
      const packetLength = bin2dec(message.slice(cursor, cursor + 15))
      cursor += 15
      const submessage = message.slice(cursor, cursor + packetLength)
      cursor += packetLength
      packet.subPackets = processPackets(submessage)
    } else if (lengthTypeID === 1) {
      const packetCount = bin2dec(message.slice(cursor, cursor + 11))
      cursor += 11
      let submessage = message.substring(cursor, message.length)
      for (let j in range(packetCount)) {
        let restMessage = processSinglePacket(submessage, packet.subPackets)
        const processedBits = submessage.length - restMessage.length
        cursor += processedBits
        submessage = restMessage
      }
    }

    packets.push(packet)
    return message.substring(cursor, message.length)
  }

  const processPackets = (message: string): Packet[] => {
    const packets: Packet[] = []
    while (message.length > 7) message = processSinglePacket(message, packets)
    return packets
  }

  const printPacket = (packet: Packet, depth: number) => {
    const operations = ['+', '*', 'min', 'max', '=', '>', '<', '==']
    log.debug(' '.repeat(depth) + '└', operations[packet.type], packet.type === 4 ? packet.value : '-')
    packet.subPackets.forEach((p) => printPacket(p, depth + 1))
  }

  const sumPacketVersions = (p: Packet): number =>
    p.version + p.subPackets?.reduce((acc, packet) => acc + sumPacketVersions(packet), 0)

  const sumPacketOperators = (packet: Packet, depth: number): number => {
    switch (packet.type) {
      case 0:
        return packet.subPackets?.reduce((acc, packet) => acc + sumPacketOperators(packet, depth + 1), 0) ?? 0
      case 1:
        return packet.subPackets?.reduce((acc, packet) => acc * sumPacketOperators(packet, depth + 1), 1) ?? 0
      case 2:
        return Math.min(...packet.subPackets?.map((packet) => sumPacketOperators(packet, depth + 1)))
      case 3:
        return Math.max(...packet.subPackets?.map((packet) => sumPacketOperators(packet, depth + 1)))
      case 4:
        return packet.value ?? 0
      case 5:
        return sumPacketOperators(packet.subPackets[0], depth + 1) > sumPacketOperators(packet.subPackets[1], depth + 1)
          ? 1
          : 0
      case 6:
        return sumPacketOperators(packet.subPackets[0], depth + 1) < sumPacketOperators(packet.subPackets[1], depth + 1)
          ? 1
          : 0
      case 7:
        return sumPacketOperators(packet.subPackets[0], depth + 1) ===
          sumPacketOperators(packet.subPackets[1], depth + 1)
          ? 1
          : 0
    }
    return 0
  }

  for await (const line of lineReader) {
    let packetLine = line
      .split('')
      .map((x: string) => hex2bin(x).padStart(4, '0'))
      .join('')
    const packets: Packet[] = processPackets(packetLine)
    part1 = packets.reduce((x, y) => x + sumPacketVersions(y), 0)
    part2 = packets.reduce((x, y) => x + sumPacketOperators(y, 0), 0)
  }

  return { part1, part2 }
}
