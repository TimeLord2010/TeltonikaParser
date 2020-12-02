import { AVL_Data as AvlData } from './AVL Data Parser/AVL_Data';
import { Data as _data } from './AVL Data Parser/Data';
import { IOelement as IoElement, getDigitalInputs as gdis, getDigitalOutputs as gdos, getAnalogInputs as gais, getFMSelements as gfms, castAVLIDtoAVLName as castid, getAnalogInputsId as gaiid, getDigitalInputsId as gdiid, getDigitalOutputsId as gdoid, getElementsWithoutFMS as gewof, getNonFMSorPhysical as gnfp, isFMSid as ifid, isIOelement as iio, isFMSorPhysical as isfp, avlidDictionary as avldict, isPhysical as isp, getOrganizedElements as goe } from './AVL Data Parser/IOelement';
import { GPRS as gprs } from './GPRS Parser/GPRSparser';
export declare class ProtocolParser {
    Packet: string;
    Preamble: number;
    Data_Length: number;
    CodecID: number;
    Quantity1: number;
    CodecType: 'data sending' | 'GPRS messages';
    Content: gprs | _data | null;
    Quantity2: number;
    CRC: number;
    constructor(packet: string, basic_read: boolean, on_ioElement_error: (e: Error) => void);
}
export declare function parseIMEI(imei: string): string;
export { gdis as getDigitalInputs, gdos as getDigitalOutputs, gais as getAnalogInputs, gfms as getFMSelements, castid as castAVLIDtoAVLName, gaiid as getAnalogInputsId, gdiid as getDigitalInputsId, gdoid as getDigitalOutputsId, gewof as getElementsWithoutFMS, gnfp as getNonFMSorPhysical, ifid as isFMSid, iio as isIOelement, isp as isPhysical, isfp as isFMSorPhysical, goe as getOrganizedElements, avldict as avlidDictionary };
export declare type Data = _data;
export declare type AVL_Data = AvlData;
export declare type IOelement = IoElement;
export declare type GPRS = gprs;
