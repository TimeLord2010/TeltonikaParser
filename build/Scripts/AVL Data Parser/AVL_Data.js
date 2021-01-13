"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVL_Data = void 0;
const GPSelement_1 = require("./GPSelement");
const IOelement_1 = require("./IOelement");
class AVL_Data {
    constructor(packet_reader, on_ioElement_error, codec_id) {
        //this.Timestamp = packet_reader.read(8) / 1000;
        this.Timestamp = new Date(packet_reader.read(8));
        this.Priority = packet_reader.read(1);
        this.GPSelement = new GPSelement_1.GPSelement(packet_reader);
        this.IOelement = new IOelement_1.IOelement(packet_reader, on_ioElement_error, codec_id);
    }
}
exports.AVL_Data = AVL_Data;
