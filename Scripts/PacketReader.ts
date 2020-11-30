
export class PacketReader <T> {
    Content : string
    Index : number
    UnitSize : number
    Converter : (x : string) => T
    IndexEnd : number
    constructor(content : string, unit_size : number, converter : (x : string) => T) {
        this.Content = content;
        this.Index = 0;
        this.UnitSize = unit_size;
        this.Converter = converter;
        this.IndexEnd = content.length;
    }

    read(length : number) {
        this._validateLength(length);
        var to_read = length * this.UnitSize;
        var value = this.Content.substring(this.Index, this.Index + to_read);
        this.Index += to_read;
        return this.Converter(value);
    }

    readEnd(length : number) {
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

    _validateLength(length : number) {
        if (length < 0)
            throw new Error('Read failed bacause the length of the data is negative');
        if (length > (this.IndexEnd - this.Index))
            throw new Error("Length of substring was greater than the string length.");
    }

}