import { PacketReader } from "../PacketReader";

export interface IGPSelement {
    Longitude: number,
    Latitude: number,
    Altitude: number,
    Angle: number,
    Satellites: number,
    Speed: number
}

const to_binary = (value: number) => (value >>> 0).toString(2)

function ProcessReal(value: number) {
    let binary = to_binary(value)
    let toSub = 2 ** binary.length
    value = value - toSub
    return value / 10000000
}

export function getGPSdata(gum: number) {
    gum <<= 32; 
    gum >>= 32;
    gum = gum / 10000000;
    return gum;
}

// export function getGPSdata(num: number) {
//     let bin = num.toString(2)
//     let [start, end] = [bin.slice(0, 1), bin.slice(1)]
//     if (start == '1') {
//         if (num >= 0) num = -num
//     } else {
//         if (num <= 0) num = -num
//     }
//     let numStr = num.toString()
//     let i = 2
//     if (num < 0) i = 3
//     num = Number(numStr.slice(0, i) + '.' + numStr.slice(i))
//     return num
// }

// export function getGPSdata(num: number) {
//     //let num = parse('20 9c ca 80')
//     //expect(num).toBe(547146368)
//     let binary = num.toString(2)
//     while (binary.length % 8 != 0) {
//         binary = "0" + binary
//     }
//     //let binary = to_binary(num)
//     //expect(binary).toBe('00100000100111001100101010000000')
//     if (binary.substr(0, 1) != '0') {
//         num *= -1
//     }
//     return num * 0.0000001
//     //expect(result).toBeCloseTo(54.714636)
// }

export function isIGPSelement(obj: any): obj is IGPSelement {
    return obj && typeof obj.Angle === 'number' && typeof obj.Longitude === 'number' && typeof obj.Latitude === 'number'
}

export function defaultGPSElement(longitude: number = 0, latitude: number = 0): IGPSelement {
    return {
        Latitude: latitude,
        Longitude: longitude,
        Altitude: 0,
        Angle: 0,
        Satellites: 0,
        Speed: 0
    }
}

export class GPSelement {

    Longitude: number
    Latitude: number
    Altitude: number
    Angle: number
    Satellites: number
    Speed: number

    constructor(packet_reader: PacketReader<number>) {
        this.Longitude = getGPSdata(packet_reader.read(4));
        this.Latitude = getGPSdata(packet_reader.read(4));
        this.Altitude = packet_reader.read(2);
        this.Angle = packet_reader.read(2);
        this.Satellites = packet_reader.read(1);
        this.Speed = packet_reader.read(2);
    }

}