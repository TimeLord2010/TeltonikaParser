import { PacketReader } from "../PacketReader";

const to_binary = (value : number) => (value >>> 0).toString(2)

function ProcessReal(value: number) {
    let binary = to_binary(value)
    let toSub = 2 ** binary.length
    value = value - toSub
    return value / 10000000
}

class GPSelement {

    Longitude: number
    Latitude: number
    Altitude: number
    Angle: number
    Satellites: number
    Speed: number

    constructor(packet_reader: PacketReader<number>) {
        this.Longitude = ProcessReal(packet_reader.read(4));
        this.Latitude = ProcessReal(packet_reader.read(4));
        this.Altitude = packet_reader.read(2);
        this.Angle = packet_reader.read(2);
        this.Satellites = packet_reader.read(1);
        this.Speed = packet_reader.read(2);
    }

}

exports.default = GPSelement