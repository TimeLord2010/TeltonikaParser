"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const to_binary = (value) => (value >>> 0).toString(2);
function ProcessReal(value) {
    let binary = to_binary(value);
    let toSub = 2 ** binary.length;
    value = value - toSub;
    return value / 10000000;
}
class GPSelement {
    constructor(packet_reader) {
        this.Longitude = ProcessReal(packet_reader.read(4));
        this.Latitude = ProcessReal(packet_reader.read(4));
        this.Altitude = packet_reader.read(2);
        this.Angle = packet_reader.read(2);
        this.Satellites = packet_reader.read(1);
        this.Speed = packet_reader.read(2);
    }
}
exports.default = GPSelement;
