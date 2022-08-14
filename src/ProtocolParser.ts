import { AVL_Data as AvlData } from './AVL Data Parser/AVL_Data';
import { Data as _data } from './AVL Data Parser/Data';
import {
    IOelement,
    isIOelement
} from './AVL Data Parser/IOelement';
import { CalcCRC16 } from './CRC16';
import { GPRS as gprs } from './GPRS Parser/GPRSparser';
import { PacketReader } from './PacketReader';


export class ProtocolParser {
    Packet: string
    Preamble: number
    Data_Length: number
    CodecID: number
    Quantity1: number
    CodecType: 'data sending' | 'GPRS messages'
    Content: gprs | _data | null
    Quantity2: number
    CRC: number

    constructor(packet: string, basic_read: boolean = false, on_ioElement_error: (e: Error) => void = (e) => { throw e }) {
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
        if (this.Preamble != 0) throw new Error(`Preamble should be 0.`)
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
        let content: Data | gprs | null = null
        if ([0x08, 0x8E, 0x10].includes(this.CodecID)) {
            this.CodecType = "data sending"
            if (!basic_read) content = new _data(pr, on_ioElement_error, this.CodecID, this.Quantity1);
        } else if ([0x0C, 0x0D, 0x0E].includes(this.CodecID)) {
            this.CodecType = "GPRS messages"
            if (!basic_read) content = new gprs(pr)
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

// export const FMB640Utils = {
//     AnalogInputsId,
//     DigitalInputsId,
//     DigitalOutputsId,
//     avlidDictionary,
//     getDigitalInputs,
//     getDigitalOutputs,
//     getAnalogInputs,
//     getFMSelements,
//     castAVLIDtoAVLName,
//     getElementsWithoutFMS,
//     getNonFMSorPhysical,
//     isFMSid,
//     isPhysical,
//     isFMSorPhysical,
//     getOrganizedElements,
//     isAnalogInput,
//     isDigitalInput,
//     isDigitalOutput,
//     getBooleanDigitalAnalog
// }

export { isIOelement };
export { IOelement };

export type Data = _data

export type AVL_Data = AvlData

//export type IOelement = IOelement

export type GPRS = gprs