export declare class PacketReader<T> {
    Content: string;
    Index: number;
    UnitSize: number;
    Converter: (x: string) => T;
    IndexEnd: number;
    constructor(content: string, unit_size: number, converter: (x: string) => T);
    read(length: number): T;
    readEnd(length: number): T;
    remainingContent(): string;
    _validateLength(length: number): void;
}
