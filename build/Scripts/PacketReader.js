"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PacketReader = void 0;
class PacketReader {
    constructor(content, unit_size, converter) {
        if (content == null) {
            throw new Error(`Content string was null in packet reader.`);
        }
        if (typeof content != 'string') {
            throw new Error(`Content was not a string in packet reader.`);
        }
        this.Content = content;
        this.Index = 0;
        this.UnitSize = unit_size;
        this.Converter = converter;
        this.IndexEnd = content.length;
    }
    read(length) {
        this._validateLength(length);
        var to_read = length * this.UnitSize;
        var value = this.Content.substring(this.Index, this.Index + to_read);
        this.Index += to_read;
        return this.Converter(value);
    }
    readEnd(length) {
        this._validateLength(length);
        var to_read = length * this.UnitSize;
        var value = this.Content.substring(this.IndexEnd - to_read, this.IndexEnd);
        this.IndexEnd -= to_read;
        return this.Converter(value);
    }
    remainingContent() {
        var value = this.Content.substring(this.Index, this.IndexEnd);
        return value;
    }
    _validateLength(length) {
        if (length < 0)
            throw new Error('Read failed bacause the length of the data is negative');
        if (length > (this.IndexEnd - this.Index))
            throw new Error("Length of substring was greater than the string length.");
    }
}
exports.PacketReader = PacketReader;
