"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolParser = void 0;
//import { IProtocolParser } from "../Interfaces/IProtocolParser";
//import { IData } from "../Interfaces/IData";
const PacketReader_1 = require("../Scripts/PacketReader");
const Data_1 = require("./AVL Data Parser/Data");
//import { IGPRSparser } from "../Interfaces/IGPRSparser";
const GPRSparser_1 = require("./GPRS Parser/GPRSparser");
const CalcCRC16 = require('./CRC16.js').CalcCRC16;
class ProtocolParser {
    constructor(packet, basic_read, on_ioElement_error) {
        var pr = new PacketReader_1.PacketReader(packet, 2, (x) => {
            var y = parseInt(x, 16);
            if (y > Number.MAX_SAFE_INTEGER) {
                y = BigInt(`0x${x}`);
                y = y.toString();
            }
            return y;
        });
        this.Packet = packet;
        this.Preamble = pr.read(4);
        this.Data_Length = pr.read(4);
        this.CodecID = pr.read(1);
        this.Quantity1 = pr.read(1);
        this.CRC = pr.readEnd(4);
        this.Quantity2 = pr.readEnd(1);
        if (this.Quantity1 != this.Quantity2)
            throw new Error(`Item quantity did not match.`);
        var crc_reader = new PacketReader_1.PacketReader(packet, 2, (x) => parseInt(x, 16));
        crc_reader.read(8);
        crc_reader.readEnd(4);
        var expected_crc = CalcCRC16(crc_reader.remainingContent());
        if (expected_crc != this.CRC)
            throw new Error(`Found CRC (${this.CRC}) wasn't the correct one (${expected_crc}).`);
        let content = null;
        if ([0x08, 0x8E, 0x10].includes(this.CodecID)) {
            this.CodecType = "data sending";
            if (!basic_read)
                content = new Data_1.Data(pr, on_ioElement_error, this.CodecID, this.Quantity1);
        }
        else if ([0x0C, 0x0D, 0x0E].includes(this.CodecID)) {
            this.CodecType = "GPRS messages";
            if (!basic_read)
                content = new GPRSparser_1.GPRS(pr);
        }
        else {
            throw new Error(`Codec ${this.CodecID} not supported.`);
        }
        this.Content = content;
    }
}
exports.ProtocolParser = ProtocolParser;
