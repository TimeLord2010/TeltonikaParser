"use strict";
function CalcCRC16(bytes) {
    if (typeof bytes === 'string' || bytes instanceof String) {
        bytes = _hexToBuffer(bytes);
    }
    const preset = 0 & 0xFFFF;
    const polynom = 0xA001 & 0xFFFF;
    var crc = preset;
    for (var i = 0; i < bytes.length; i++) {
        crc ^= bytes[i];
        for (var j = 0; j < 8; j++) {
            crc = (crc & 0x0001) != 0 ? (crc >> 1) ^ polynom : crc >> 1;
        }
    }
    return crc & 0xFFFF;
}
function _hexToBuffer(hex) {
    if (hex.length % 2 != 0) {
        throw new Error(`Hexadecimal string is not properly formated. Check if the conversion casts numbers like '10' to '0A' and not to 'A'`);
    }
    var bytes = new Uint8Array(hex.length / 2);
    var i = 0;
    for (var c = 0; c < hex.length; c += 2) {
        bytes[i] = parseInt(hex.substr(c, 2), 16);
        i++;
    }
    return bytes;
}
function _hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}
exports.CalcCRC16 = CalcCRC16;
