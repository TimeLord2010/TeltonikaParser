//const PacketReader = require('./../Scripts/PacketReader').default
//const CalcCRC16 = require('./../.../Scripts/CRC16').CalcCRC16;

import { PacketReader } from "../../Scripts/PacketReader"
import { toHex, splitAt, hexToAscII } from "../utils/stringUtil"
import { CalcCRC16 } from '../CRC16'

export class GPRS {

    type : 5 | 6
    isResponse : boolean
    responseStr : string

    constructor(pr: PacketReader<number>) {
        let type = pr.read(1)
        switch (type) {
            case 0x05:
                this.isResponse = false
                break
            case 0x06:
                this.isResponse = true
                break
            default:
                throw new Error(`Invalid type value.`)
        }
        this.type = type
        const responseSize = pr.read(4)
        var arr = []
        for (let i = 0; i < responseSize; i++) {
            let code = pr.read(1)
            arr.push(code)
        }
        let letters = arr.map(x => String.fromCharCode(x))
        this.responseStr = letters.join("")
    }
}

// The below methods were writen using a different implementation and are in test phase. 
// They will soon be used in the main implementation of GPRS codecs.

const calcCRC16 = (str: string) => CalcCRC16(str).toString(16).padStart(8, '0')

export function gerateCodec12 (command: string) {
    command = toHex(command)
    let commandSize = (command.length / 2).toString(16)
    let data = {
        CodecID: '0C',
        CommandQuantity1: '01',
        Type: '5'.padStart(2, '0'), // in case of a response, this value will be '6'
        CommandSize: commandSize.padStart(8, '0'),
        Command: command,
        CommandQuantity2: '01',
    }
    let dataStr = Object.values(data).reduce((acc, item) => acc + item, '')
    let returnObj = ''.padStart(8, '0') + (dataStr.length/2).toString(16).padStart(8, '0') + dataStr + calcCRC16(dataStr)
    return returnObj.toUpperCase()
}

export function parseCodec12 (hexStr: string) {
    let [preamble, content, crc] = splitAt(hexStr, 8, -8)
    if (preamble !== ''.padStart(8, '0')) throw new Error(`Invalid preamble.`)
    let [dataSize, data] = splitAt(content, 8)
    if (parseInt(dataSize, 16) !== data.length / 2) throw new Error(`Data size doesn't match with the actual data size.`)
    let calculatedCRC = calcCRC16(data)
    if (crc !== calculatedCRC) throw new Error(`CRCs don't match.`)
    let [codec, quantity1, type, commandContent, quantity2] = splitAt(data, 2, 2, 2, -2)
    if (quantity1 !== quantity2) throw new Error(`Command quantity did not match.`)
    if (codec == '0C') {
        if (!['05', '06'].includes(type)) throw new Error(`Invalid type.`)
        let [commandSize, command] = splitAt(commandContent, 8)
        if (parseInt(commandSize, 16) !== command.length / 2)  throw new Error(`Command/Response size doesn't match with the actual size.`)
        return {
            isResponse: type === '06',
            command: hexToAscII(command)
        }
    } else {
        throw new Error(`Not implemented`)
    }
}