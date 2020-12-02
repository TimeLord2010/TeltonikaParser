import { PacketReader } from "../../Scripts/PacketReader";
import { AVL_Data } from './AVL_Data';
export declare class Data {
    AVL_Datas: AVL_Data[];
    constructor(packet_reader: PacketReader<number>, on_oiElement_error: (e: Error) => void, codec: number, quantity: number);
}
