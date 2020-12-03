import { PacketReader } from "../../Scripts/PacketReader";
import { Iphysical } from "../../Interfaces/Ilog";
import { IavlDict } from "../../Interfaces/IavlDict";

/**
* Dictionary for avl name, given the AVL ID.
* For some cases, the value is a dictionary containing the avl name and the respective table name.
* When the table name is 0, it means that there is not table for that avl.
*/
export const avlidDictionary: IavlDict = {
    1: {
        "AVL_Name": "Digital Input 1",
        TableName: "DigitalInput1"
    },
    2: "Digital Input 2",
    3: "Digital Input 3",
    4: {
        AVL_Name: "Digital Input 4",
        TableName: "DigitalInput4"
    },
    5: {
        AVL_Name: "Dallas Temperature ID 5",
        TableName: 0
    },
    9: "Analog Input 1",
    10: "Analog Input 2",
    11: "Analog Input 3",
    21: {
        "AVL_Name": "GSM Signal",
        "TableName": "GsmSignal"
    },
    22: "Data Mode",
    24: {
        "AVL_Name": "Speed",
        "TableName": 0
    },
    50: "Digital Output 3",
    51: "Digital Output 4",
    66: "External Voltage",
    67: "Battery Voltage",
    68: "Battery Current",
    70: {
        "AVL_Name": "PCB Temperature",
        "TableName": 'PcbTemperature'
    },
    71: {
        "AVL_Name": "GNSS Status",
        "TableName": 'GnssSignal'
    },
    72: "Dallas Temperature 1",
    78: "iButton",
    79: {
        "AVL_Name": "Brake Switch"
    },
    80: "Wheel Based Speed",
    81: "Cruise Control Active",
    82: "Clutch Switch",
    83: "PTO State",
    84: "Acceleration Pedal Position",
    85: "Engine Current Load",
    86: "Engine Total Fuel Used",
    87: "Fuel Level",
    88: "Engine Speed",
    89: "Axle weight 1",
    90: "Axle weight 2",
    91: "Axle weight 3",
    92: "Axle weight 4",
    93: "Axle weight 5",
    94: "Axle weight 6",
    95: "Axle weight 7",
    96: "Axle weight 8",
    97: "Axle weight 9",
    98: "Axle weight 10",
    99: "Axle weight 11",
    100: "Axle weight 12",
    101: "Axle weight 13",
    102: "Axle weight 14",
    103: "Axle weight 15",
    104: "Engine Total Hours Of Operation",
    110: "Diagnostics Supported",
    113: "Service Distance",
    122: "Direction Indication",
    123: "Tachograph Performance",
    124: "Handling Info",
    125: "System Event",
    127: "Engine Coolant Temperature",
    128: "Ambient Air Temperature",
    135: "Fuel Rate",
    136: "Instantaneous Fuel Economy",
    137: "PTO Drive Engagement",
    138: "High Resolution Engine Total Fuel Used",
    139: "Gross Combination Vehicle Weight",
    144: {
        "AVL_Name": "SD Status",
        'TableName': 'SdStatus'
    },
    178: {
        "AVL_Name": 'Network Type',
        'TableName': 0
    },
    179: "Digital Output 1",
    180: "Digital Output 2",
    181: {
        'AVL_Name': "GNSS PDOP",
        "TableName": 0
    },
    182: {
        'AVL_Name': "GNSS HDOP",
        "TableName": 0
    },
    199: "Trip Odometer",
    200: "Sleep Mode",
    205: {
        'AVL_Name': "GSM Cell ID",
        "TableName": 0
    },
    206: {
        'AVL_Name': "GSM Area Code",
        "TableName": 0
    },
    216: "Total Odometer",
    218: {
        'AVL_Name': 'IMSI',
        "TableName": 0
    },
    219: {
        'AVL_Name': 'CCID Part1',
        "TableName": 0
    },
    220: {
        'AVL_Name': 'CCID Part2',
        "TableName": 0
    },
    221: {
        'AVL_Name': 'CCID Part3',
        "TableName": 0
    },
    236: "Axis X",
    237: "Axis Y",
    238: "Axis Z",
    239: "Ignition",
    240: "Movement",
    241: {
        'AVL_Name': "Active GSM Operator",
        "TableName": 0
    },
    243: "Idling",
    245: "Analog Input 4",
    246: "Towing",
    247: "Crash Detection",
    249: "Jamming",
    251: "Immobilizer",
    253: "Green Driving Type",
    255: "Over Speeding",
    10348: "Fuel level 2",
    10349: "MIL indicator",
    10428: "Tell Tale 0",
    10429: "Tell Tale 1",
    10430: "Tell Tale 2",
    10431: "Tell Tale 3",
};

export let getDigitalInputsId = () => [1, 2, 3, 4]

export let getDigitalOutputsId = () => [179, 180, 50, 51]

export let getAnalogInputsId = () => [9, 10, 11, 245]

export let isDigitalInput = (id: number) => [1, 2, 3, 4].includes(id)

export let isDigitalOutput = (id: number) => [179, 180, 50, 51].includes(id)

export let isAnalogInput = (id: number) => [9, 10, 11, 245].includes(id)

export let isPhysical = (id: number) => isDigitalInput(id) || isDigitalOutput(id) || isAnalogInput(id)

export function isFMSid(id: number) {
    return (id >= 79 && id <= 113) || (id >= 122 && id <= 128) || (id >= 135 && id <= 139) || (id >= 10348 && id <= 10431)
}

export function isFMSorPhysical(id: number) {
    return isPhysical(id) || isFMSid(id)
}

export function castAVLIDtoAVLName(elements: getOrganizedElementsReturn | null = null) {
    var avl_names: { [avlName: string]: any } = {}
    //if (elements == null) elements = this.Elements
    if (!elements) return avl_names
    var keys = Object.keys(elements)
    for (var i = 0; i < keys.length; i++) {
        var id = keys[i]
        // @ts-ignore
        var value = elements[id];
        if (id == 'FMS') {
            avl_names['FMS'] = castAVLIDtoAVLName(value);
            continue;
        }
        if (!avlidDictionary.hasOwnProperty(id)) continue
        var translated = avlidDictionary[Number(id)];
        if (translated == null) continue
        if (typeof translated === 'string') {
            avl_names[translated] = value;
        } else {
            if (!translated.hasOwnProperty("AVL_Name")) continue
            avl_names[translated.AVL_Name] = value;
        }
    }
    return avl_names;
}

export function getFMSelements(_elements: Record<number, number | string> | IOelement) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements
    var obj: { [avlId: number]: number | string } = {}
    var keys = Object.keys(elements);
    for (var i = 0; i < keys.length; i++) {
        var id = Number(keys[i])
        if (!isFMSid(id)) continue
        var value = elements[id]
        obj[id] = value
    }
    return obj
}

export function getElementsWithoutFMS(elements: Record<number, number | string>): Record<number, number | string> {
    var obj: any = {}
    var keys = Object.entries(elements).map(x => {
        return { id: Number(x[0]), value: x[1] }
    }).filter(x => !isFMSid(x.id));
    for (let { id, value } of keys) {
        obj[id] = value
    }
    return obj
}

interface getOrganizedElementsReturn {
    FMS: Record<number, number | string>
    [avlId: number]: number | string,
}

export function getOrganizedElements(_elements: Record<number, number | string> | IOelement): getOrganizedElementsReturn {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements
    var obj = getElementsWithoutFMS(elements) as any;
    obj['FMS'] = getFMSelements(elements);
    return obj
}

export function getDigitalInputs(_elements: Record<number, number | string> | IOelement): Iphysical<boolean> {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements
    return {
        1: elements[1] == 1,
        2: elements[2] == 1,
        3: elements[3] == 1,
        4: elements[4] == 1
    }
}

export function getDigitalOutputs(_elements: Record<number, number | string> | IOelement) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements
    return {
        1: elements[179] == 1,
        2: elements[180] == 1,
        3: elements[50] == 1,
        4: elements[51] == 1
    }
}

export function getAnalogInputs(_elements: Record<number, number | string> | IOelement) {
    let elements = isIOelement(_elements) ? _elements.Elements : _elements
    return {
        1: elements[9],
        2: elements[10],
        3: elements[11],
        4: elements[245]
    }
}

export function getNonFMSorPhysical(_elements: Record<number, number | string> | { Elements : Record<number, number | string>}) {
    let elements = hasElements(_elements) ? _elements.Elements : _elements
    let nonFMSorPhysical: { [id: number]: number | string } = {}
    for (let [key, value] of Object.entries(elements)) {
        let id = Number(key)
        if (Number.isNaN(id)) throw new Error(`Invalid id in 'getNonFMSorPhysical'. Parameter elements: ${JSON.stringify(elements)}`)
        if (isFMSorPhysical(id)) continue
        nonFMSorPhysical[id] = value
    }
    return nonFMSorPhysical
}

function hasElements (obj : any) : obj is { Elements: Record<number, number | string>} {
    return obj && obj.Elements
}

// export function getNotFMSorPhysical(elements: { [id: number]: number | string }) {
//     let elements = isIOelement(_elements) ? _elements.Elements : _elements
//     return getNotFMSorPhysical(elements)
// }

export function isIOelement(obj: any): obj is IOelement {
    return typeof obj === 'object' && typeof obj.EventID === 'number' && typeof obj.ElementCount === 'number'
}

export class IOelement {
    EventID: number
    ElementCount: number
    Elements: {
        [avlid: number]: number | string
    }
    constructor(reader: PacketReader<any>, on_error: (e: Error) => void, codec_id: number) {
        if (reader == null) {
            throw new Error(`Reader not given`)
        }
        if (codec_id == null) {
            throw new Error(`Codec Id not given.`)
        }
        var id_size = codec_id == 0x08 ? 1 : 2;
        this.EventID = reader.read(id_size)
        this.ElementCount = reader.read(id_size);
        var element_value_length = 1;
        this.Elements = {};
        var elements_count = reader.read(id_size);
        let safeSet = (id: number, value: number | string) => {
            if (this.Elements.hasOwnProperty(`${id}`)) {
                throw new Error(`Repeated id '${id}' in IOElement.`);
            }
            this.Elements[id] = value;
        }
        try {
            while (true) {
                while (elements_count < 1 && element_value_length < 8) {
                    //if (element_value_length == 8) break
                    elements_count = reader.read(id_size);
                    element_value_length *= 2;
                }
                if (elements_count-- <= 0) break;
                //elements_count--;
                var id = reader.read(id_size);
                var value = reader.read(element_value_length);
                safeSet(id, value)
                // if (this.Elements.hasOwnProperty(`${id}`)) {
                //     throw new Error(`Repeated id '${id}' in IOElement.`);
                // }
                // this.Elements[id] = value;
            }
            if (codec_id == 0x08) {
                while (element_value_length < 8) {
                    reader.read(id_size);
                    element_value_length *= 2;
                }
            }
            if (codec_id == 0x8E) {
                if (element_value_length != 8) {
                    throw new Error(`Element value length should be 8. Got ${element_value_length}.`)
                }
                elements_count = reader.read(2)
                for (var i = 0; i < elements_count; i++) {
                    var id = reader.read(2);
                    element_value_length = reader.read(2);
                    var value = reader.read(element_value_length);
                    safeSet(id, value)
                }
            }
        } catch (e) {
            if (on_error != null) on_error(e);
        }
    }

}