"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const to_binary = (value) => (value >>> 0).toString(2);
function ProcessReal(value) {
    let binary = to_binary(value);
    let toSub = 2 ** binary.length;
    value = value - toSub;
    return value / 10000000;
}
function getGPSdata(num) {
    //let num = parse('20 9c ca 80')
    //expect(num).toBe(547146368)
    let binary = num.toString(2);
    while (binary.length % 8 != 0) {
        binary = "0" + binary;
    }
    //let binary = to_binary(num)
    //expect(binary).toBe('00100000100111001100101010000000')
    if (binary.substr(0, 1) != '0') {
        num *= -1;
    }
    return num * 0.0000001;
    //expect(result).toBeCloseTo(54.714636)
}
class GPSelement {
    constructor(packet_reader) {
        this.Longitude = getGPSdata(packet_reader.read(4));
        this.Latitude = getGPSdata(packet_reader.read(4));
        this.Altitude = packet_reader.read(2);
        this.Angle = packet_reader.read(2);
        this.Satellites = packet_reader.read(1);
        this.Speed = packet_reader.read(2);
    }
}
exports.default = GPSelement;
