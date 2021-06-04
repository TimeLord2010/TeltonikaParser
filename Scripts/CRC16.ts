
export function CalcCRC16(bytes: string | Uint8Array) {
    if (typeof bytes === 'string') {
        bytes = hexToBuffer(bytes);
    }
    const preset = 0 & 0xFFFF;
    const polynom = 0xA001 & 0xFFFF;
    let crc = preset;
    for (let i = 0; i < bytes.length; i++) {
        crc ^= bytes[i];
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x0001) != 0 ? (crc >> 1) ^ polynom : crc >> 1;
        }
    }
    return crc & 0xFFFF;
}

function hexToBuffer(hex: string) {
    if (hex.length % 2 != 0) 
        throw new Error(`Hexadecimal string is not properly formated. Check if the conversion casts numbers like '10' to '0A' and not to 'A'`);
    let bytes = new Uint8Array(hex.length / 2);
    for (let c = 0, i = 0; c < hex.length; c += 2, i++) {
        bytes[i] = parseInt(hex.substr(c, 2), 16);
    }
    return bytes;
}