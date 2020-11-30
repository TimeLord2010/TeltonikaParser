"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
//import { IData } from '../../Interfaces/IData'
//import { IAVL_Data } from "../../Interfaces/IAVL_Data";
const AVL_Data_1 = require("./AVL_Data");
class Data {
    constructor(packet_reader, on_oiElement_error, codec, quantity) {
        this.AVL_Datas = [];
        for (var i = 0; i < quantity; i++) {
            var avl_data = new AVL_Data_1.AVL_Data(packet_reader, on_oiElement_error, codec);
            this.AVL_Datas.push(avl_data);
        }
    }
}
exports.Data = Data;
