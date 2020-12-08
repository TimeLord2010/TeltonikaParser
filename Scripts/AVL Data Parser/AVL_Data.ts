import { PacketReader } from "../../Scripts/PacketReader";
import { IGPSelement } from "./GPSelement";
import { IOelement } from "./IOelement";

const GPSelement = require('./GPSelement.js').default;

export class AVL_Data  {
    Timestamp : Date
    //Timestamp : number
    Priority : number
    GPSelement : IGPSelement
    IOelement : IOelement

    constructor(packet_reader : PacketReader<number>, on_ioElement_error : (e : Error) => void, codec_id : number) {
        //this.Timestamp = packet_reader.read(8) / 1000;
        this.Timestamp = new Date(packet_reader.read(8))
        this.Priority = packet_reader.read(1)
        this.GPSelement = new GPSelement(packet_reader)
        this.IOelement = new IOelement(packet_reader, on_ioElement_error, codec_id)
    }

}