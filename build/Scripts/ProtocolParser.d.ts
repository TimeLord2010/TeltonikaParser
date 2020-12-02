import { AVL_Data as AvlData } from './AVL Data Parser/AVL_Data';
import { Data } from './AVL Data Parser/Data';
import { IOelement as IoElement } from './AVL Data Parser/IOelement';
import { GPRS } from './GPRS Parser/GPRSparser';
export declare class ProtocolParser {
    Packet: string;
    Preamble: number;
    Data_Length: number;
    CodecID: number;
    Quantity1: number;
    CodecType: 'data sending' | 'GPRS messages';
    Content: GPRS | Data | null;
    Quantity2: number;
    CRC: number;
    constructor(packet: string, basic_read: boolean, on_ioElement_error: (e: Error) => void);
}
export declare function parseIMEI(imei: string): string;
export declare type AVL_Data = AvlData;
export declare type IOelement = IoElement;
