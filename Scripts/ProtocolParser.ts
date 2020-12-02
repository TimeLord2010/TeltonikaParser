//import { IProtocolParser } from "../Interfaces/IProtocolParser";
//import { IData } from "../Interfaces/IData";
import { PacketReader } from '../Scripts/PacketReader'
import { AVL_Data as AvlData } from './AVL Data Parser/AVL_Data';
import { Data as _data } from './AVL Data Parser/Data'
import {IOelement as IoElement} from './AVL Data Parser/IOelement'
//import { IGPRSparser } from "../Interfaces/IGPRSparser";
import { GPRS } from './GPRS Parser/GPRSparser'

const CalcCRC16 = require('./CRC16.js').CalcCRC16;

export class ProtocolParser {
    Packet : string
    Preamble: number
    Data_Length: number
    CodecID: number
    Quantity1: number
    CodecType: 'data sending' | 'GPRS messages'
    Content : GPRS | _data | null
    Quantity2: number
    CRC: number

    constructor(packet: string, basic_read: boolean, on_ioElement_error: (e: Error) => void) {
        var pr = new PacketReader<number>(packet, 2, (x: string) => {
            var y: any = parseInt(x, 16);
            if (y > Number.MAX_SAFE_INTEGER) {
                y = BigInt(`0x${x}`);
                y = y.toString()
            }
            return y;
        });
        this.Packet = packet
        this.Preamble = pr.read(4)
        this.Data_Length = pr.read(4)
        this.CodecID = pr.read(1)
        this.Quantity1 = pr.read(1)
        this.CRC = pr.readEnd(4);
        this.Quantity2 = pr.readEnd(1)
        if (this.Quantity1 != this.Quantity2) throw new Error(`Item quantity did not match.`);
        var crc_reader = new PacketReader(packet, 2, (x: string) => parseInt(x, 16));
        crc_reader.read(8);
        crc_reader.readEnd(4);
        var expected_crc = CalcCRC16(crc_reader.remainingContent());
        if (expected_crc != this.CRC)
            throw new Error(`Found CRC (${this.CRC}) wasn't the correct one (${expected_crc}).`)
        let content : Data | GPRS | null = null
        if ([0x08, 0x8E, 0x10].includes(this.CodecID)) {
            this.CodecType = "data sending"
            if (!basic_read) content = new _data(pr, on_ioElement_error, this.CodecID, this.Quantity1);
        } else if ([0x0C, 0x0D, 0x0E].includes(this.CodecID)) {
            this.CodecType = "GPRS messages"
            if (!basic_read) content = new GPRS(pr)
        } else {
            throw new Error(`Codec ${this.CodecID} not supported.`)
        }
        this.Content = content
    }
}

export function parseIMEI(imei: string): string {
    var decodedIMEI = "";
    for (var i = imei.length - 1; i > 3; i -= 2)
        decodedIMEI = imei.charAt(i) + decodedIMEI;
    return decodedIMEI
}

export type Data = _data

export type AVL_Data = AvlData

export type IOelement = IoElement