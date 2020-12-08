import { PacketReader } from "../PacketReader";
export interface IGPSelement {
    Longitude: number;
    Latitude: number;
    Altitude: number;
    Angle: number;
    Satellites: number;
    Speed: number;
}
export declare function isIGPSelement(obj: any): obj is IGPSelement;
export declare function defaultGPSElement(longitude?: number, latitude?: number): IGPSelement;
export declare class GPSelement {
    Longitude: number;
    Latitude: number;
    Altitude: number;
    Angle: number;
    Satellites: number;
    Speed: number;
    constructor(packet_reader: PacketReader<number>);
}
