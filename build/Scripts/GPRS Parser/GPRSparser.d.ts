import { PacketReader } from "../../Scripts/PacketReader";
export declare class GPRS {
    type: 5 | 6;
    isResponse: boolean;
    responseStr: string;
    constructor(pr: PacketReader<number>);
}
