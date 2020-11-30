"use strict";
0;
class GPSelement {
    constructor(packet_reader) {
        this.Longitude = this.ProcessReal(packet_reader.read(4));
        this.Latitude = this.ProcessReal(packet_reader.read(4));
        this.Altitude = packet_reader.read(2);
        this.Angle = packet_reader.read(2);
        this.Satellites = packet_reader.read(1);
        this.Speed = packet_reader.read(2);
    }
    ProcessReal(value) {
        //return value / 10000000.0;
        var binary = this.to_binary(value);
        value = (value - (2 ** binary.length)) / (10 ** 7);
        try {
            //return value
            return value.toLocaleString('fullwide', { useGrouping: false });
        }
        catch (e) {
            return NaN;
        }
    }
    to_binary(value) {
        return (value >>> 0).toString(2);
    }
}
exports.default = GPSelement;
