import { PacketReader } from "../../Scripts/PacketReader";
import { Iphysical } from "../../Interfaces/Ilog";
import { IavlDict } from "../../Interfaces/IavlDict";
/**
* Dictionary for avl name, given the AVL ID.
* For some cases, the value is a dictionary containing the avl name and the respective table name.
* When the table name is 0, it means that there is not table for that avl.
*/
export declare const avlidDictionary: IavlDict;
export declare const DigitalInputsId: number[];
export declare const DigitalOutputsId: number[];
export declare const AnalogInputsId: number[];
export declare let isDigitalInput: (id: number) => boolean;
export declare let isDigitalOutput: (id: number) => boolean;
export declare let isAnalogInput: (id: number) => boolean;
export declare let isPhysical: (id: number) => boolean;
export declare function isFMSid(id: number): boolean;
export declare function isFMSorPhysical(id: number): boolean;
export declare function getBooleanDigitalAnalog(id: number, value: number): boolean;
export declare function castAVLIDtoAVLName(elements?: getOrganizedElementsReturn | null): {
    [avlName: string]: any;
};
export declare function getFMSelements(_elements: Record<number, number | string> | IOelement): {
    [avlId: number]: string | number;
};
export declare function getElementsWithoutFMS(elements: Record<number, number | string>): Record<number, number | string>;
interface getOrganizedElementsReturn {
    FMS: Record<number, number | string>;
    [avlId: number]: number | string;
}
export declare function getOrganizedElements(_elements: Record<number, number | string> | IOelement): getOrganizedElementsReturn;
export declare function getDigitalInputs(_elements: Record<number, number | string> | IOelement): Iphysical<boolean>;
export declare function getDigitalOutputs(_elements: Record<number, number | string> | IOelement): Record<number, boolean>;
export declare function getAnalogInputs(_elements: Record<number, number | string> | IOelement): {
    1: number;
    2: number;
    3: number;
    4: number;
};
export declare function getNonFMSorPhysical(_elements: Record<number, number | string> | {
    Elements: Record<number, number | string>;
}): {
    [id: number]: string | number;
};
export declare function isIOelement(obj: any): obj is IOelement;
export declare class IOelement {
    EventID: number;
    ElementCount: number;
    Elements: {
        [avlid: number]: number | string;
    };
    constructor(reader: PacketReader<any>, on_error: (e: Error) => void, codec_id: number);
}
export {};
