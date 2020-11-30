"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVL_Data = void 0;
const IOelement_1 = require("./IOelement");
const GPSelement = require('./GPSelement.js').default;
class AVL_Data {
    constructor(packet_reader, on_ioElement_error, codec_id) {
        //this.Timestamp = packet_reader.read(8) / 1000;
        this.Timestamp = new Date(packet_reader.read(8));
        this.Priority = packet_reader.read(1);
        this.GPSelement = new GPSelement(packet_reader);
        this.IOelement = new IOelement_1.IOelement(packet_reader, on_ioElement_error, codec_id);
    }
}
exports.AVL_Data = AVL_Data;
