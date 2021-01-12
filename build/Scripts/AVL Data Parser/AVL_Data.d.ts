import { PacketReader } from "../../Scripts/PacketReader";
import { IGPSelement } from "./GPSelement";
import { IOelement } from "./IOelement";
export declare class AVL_Data {
    Timestamp: Date;
    Priority: number;
    GPSelement: IGPSelement;
    IOelement: IOelement;
    constructor(packet_reader: PacketReader<number>, on_ioElement_error: (e: Error) => void, codec_id: number);
}
