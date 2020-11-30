import { PacketReader } from "../../Scripts/PacketReader";
//import { IData } from '../../Interfaces/IData'
//import { IAVL_Data } from "../../Interfaces/IAVL_Data";
import {AVL_Data} from './AVL_Data'

export class Data {
    AVL_Datas : AVL_Data[] = []
    constructor(packet_reader : PacketReader<number>, on_oiElement_error : (e : Error) => void, codec : number, quantity : number) {
        for (var i = 0; i < quantity; i++) {
            var avl_data = new AVL_Data(packet_reader, on_oiElement_error, codec);
            this.AVL_Datas.push(avl_data);
        }
    }

}