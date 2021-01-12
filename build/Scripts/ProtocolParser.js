"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IOelement = exports.isIOelement = exports.FMB640Utils = exports.parseIMEI = exports.ProtocolParser = void 0;
//import { IProtocolParser } from "../Interfaces/IProtocolParser";
//import { IData } from "../Interfaces/IData";
const PacketReader_1 = require("../Scripts/PacketReader");
const Data_1 = require("./AVL Data Parser/Data");
const IOelement_1 = require("./AVL Data Parser/IOelement");
Object.defineProperty(exports, "IOelement", { enumerable: true, get: function () { return 
    //IOelement as IoElement, 
    IOelement_1.IOelement; } });
Object.defineProperty(exports, "isIOelement", { enumerable: true, get: function () { return IOelement_1.isIOelement; } });
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
function parseIMEI(imei) {
    var decodedIMEI = "";
    for (var i = imei.length - 1; i > 3; i -= 2)
        decodedIMEI = imei.charAt(i) + decodedIMEI;
    return decodedIMEI;
}
exports.parseIMEI = parseIMEI;
//export const getDigitalOutputs
exports.FMB640Utils = {
    // aiid as AnalogInputsId, 
    // diid as DigitalInputsId, 
    // doid as DigitalOutputsId, 
    // avldict as avlidDictionary,
    // gdis as getDigitalInputs, 
    // gdos as getDigitalOutputs, 
    // gais as getAnalogInputs, 
    // gfms as getFMSelements, 
    // castid as castAVLIDtoAVLName, 
    // gewof as getElementsWithoutFMS, 
    // gnfp as getNonFMSorPhysical, 
    // ifid as isFMSid, 
    // iio as isIOelement, 
    // isp as isPhysical, 
    // isfp as isFMSorPhysical, 
    // goe as getOrganizedElements, 
    // iai as isAnalogInput, 
    // idi as isDigitalInput, 
    // ido as isDigitalOutput, 
    AnalogInputsId: IOelement_1.AnalogInputsId,
    DigitalInputsId: IOelement_1.DigitalInputsId,
    DigitalOutputsId: IOelement_1.DigitalOutputsId,
    avlidDictionary: IOelement_1.avlidDictionary,
    getDigitalInputs: IOelement_1.getDigitalInputs,
    getDigitalOutputs: IOelement_1.getDigitalOutputs,
    getAnalogInputs: IOelement_1.getAnalogInputs,
    getFMSelements: IOelement_1.getFMSelements,
    castAVLIDtoAVLName: IOelement_1.castAVLIDtoAVLName,
    getElementsWithoutFMS: IOelement_1.getElementsWithoutFMS,
    getNonFMSorPhysical: IOelement_1.getNonFMSorPhysical,
    isFMSid: IOelement_1.isFMSid,
    isPhysical: IOelement_1.isPhysical,
    isFMSorPhysical: IOelement_1.isFMSorPhysical,
    getOrganizedElements: IOelement_1.getOrganizedElements,
    isAnalogInput: IOelement_1.isAnalogInput,
    isDigitalInput: IOelement_1.isDigitalInput,
    isDigitalOutput: IOelement_1.isDigitalOutput,
    getBooleanDigitalAnalog: IOelement_1.getBooleanDigitalAnalog
};
