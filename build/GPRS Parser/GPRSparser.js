"use strict";
//const PacketReader = require('./../Scripts/PacketReader').default
//const CalcCRC16 = require('./../.../Scripts/CRC16').CalcCRC16;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPRS = void 0;
class GPRS {
    constructor(pr) {
        let type = pr.read(1);
        switch (type) {
            case 0x05:
                this.isResponse = false;
                break;
            case 0x06:
                this.isResponse = true;
                break;
            default:
                throw new Error(`Invalid type value.`);
        }
        this.type = type;
        const responseSize = pr.read(4);
        var arr = [];
        for (let i = 0; i < responseSize; i++) {
            let code = pr.read(1);
            arr.push(code);
        }
        let letters = arr.map(x => String.fromCharCode(x));
        this.responseStr = letters.join("");
    }
}
exports.GPRS = GPRS;
