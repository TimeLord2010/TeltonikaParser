import { Iphysical } from "../../Interfaces/Ilog";
import { PacketReader } from "../PacketReader";
import { avlidDictionary as FMB640AvlidDictionary } from "./FMB640/avlDict";

export const DigitalInputsId = [1, 2, 3, 4];

export const DigitalOutputsId = [179, 180, 50, 51];

export const AnalogInputsId = [9, 10, 11, 245];

export let isDigitalInput = (id: number) => [1, 2, 3, 4].includes(id);

export let isDigitalOutput = (id: number) => [179, 180, 50, 51].includes(id);

export let isAnalogInput = (id: number) => [9, 10, 11, 245].includes(id);

export let isPhysical = (id: number) =>
  isDigitalInput(id) || isDigitalOutput(id) || isAnalogInput(id);

export function isFMSid(id: number) {
  return (
    (id >= 79 && id <= 113) ||
    (id >= 122 && id <= 128) ||
    (id >= 135 && id <= 139) ||
    (id >= 10348 && id <= 10431)
  );
}

export function isFMSorPhysical(id: number) {
  return isPhysical(id) || isFMSid(id);
}

export function getBooleanDigitalAnalog(id: number, value: number) {
  if (AnalogInputsId.includes(id)) {
    return value > 6000;
  }
  if (DigitalInputsId.includes(id) || DigitalOutputsId.includes(id)) {
    return value == 1;
  }
  throw new Error(`Id is not from digital or analog element.`);
}

export function castAVLIDtoAVLName(
  elements: getOrganizedElementsReturn | null = null,
  avlidDictionary: { [id: number]: string } = FMB640AvlidDictionary
) {
  var avl_names: { [avlName: string]: any } = {};
  //if (elements == null) elements = this.Elements
  if (!elements) return avl_names;
  var keys = Object.keys(elements);
  for (var i = 0; i < keys.length; i++) {
    var id = keys[i];
    // @ts-ignore
    var value = elements[id];
    if (id == "FMS") {
      avl_names["FMS"] = castAVLIDtoAVLName(value);
      continue;
    }
    if (!avlidDictionary.hasOwnProperty(id)) continue;
    var translated = avlidDictionary[Number(id)];
    if (translated == null) continue;
    if (typeof translated === "string") {
      avl_names[translated] = value;
    }
  }
  return avl_names;
}

export function getFMSelements(
  _elements: Record<number, number | string> | IOelement
) {
  let elements = isIOelement(_elements) ? _elements.Elements : _elements;
  var obj: { [avlId: number]: number | string } = {};
  var keys = Object.keys(elements);
  for (var i = 0; i < keys.length; i++) {
    var id = Number(keys[i]);
    if (!isFMSid(id)) continue;
    var value = elements[id];
    obj[id] = value;
  }
  return obj;
}

export function getElementsWithoutFMS(
  elements: Record<number, number | string>
): Record<number, number | string> {
  var obj: any = {};
  var keys = Object.entries(elements)
    .map((x) => {
      return { id: Number(x[0]), value: x[1] };
    })
    .filter((x) => !isFMSid(x.id));
  for (let { id, value } of keys) {
    obj[id] = value;
  }
  return obj;
}

interface getOrganizedElementsReturn {
  FMS: Record<number, number | string>;
  [avlId: number]: number | string;
}

export function getOrganizedElements(
  _elements: Record<number, number | string> | IOelement
): getOrganizedElementsReturn {
  let elements = isIOelement(_elements) ? _elements.Elements : _elements;
  var obj = getElementsWithoutFMS(elements) as any;
  obj["FMS"] = getFMSelements(elements);
  return obj;
}

function getDigitals(elements: Record<number, number | string>, ids: number[]) {
  if (ids.length != 4) throw new Error("Physical values must have length 4.");
  let obj: Record<number, boolean> = {};
  for (let i = 0; i < 4; i++) {
    let value = elements[ids[i]];
    if (value != null) obj[i + 1] = value == 1;
  }
  return obj;
}

export function getDigitalInputs(
  _elements: Record<number, number | string> | IOelement
): Iphysical<boolean> {
  let elements = isIOelement(_elements) ? _elements.Elements : _elements;
  return getDigitals(elements, [1, 2, 3, 4]);
  // return {
  //     1: elements[1] == 1,
  //     2: elements[2] == 1,
  //     3: elements[3] == 1,
  //     4: elements[4] == 1
  // }
}

export function getDigitalOutputs(
  _elements: Record<number, number | string> | IOelement
) {
  let elements = isIOelement(_elements) ? _elements.Elements : _elements;
  return getDigitals(elements, [179, 180, 50, 51]);
  // return {
  //     1: elements[179] == 1,
  //     2: elements[180] == 1,
  //     3: elements[50] == 1,
  //     4: elements[51] == 1
  // }
}

export function getAnalogInputs(
  _elements: Record<number, number | string> | IOelement
) {
  let elements = isIOelement(_elements) ? _elements.Elements : _elements;
  let analogs: Partial<Record<1 | 2 | 3 | 4, number>> = {};
  if (typeof elements[9] == "number") analogs[1] = elements[9];
  if (typeof elements[10] == "number") analogs[2] = elements[10];
  if (typeof elements[11] == "number") analogs[3] = elements[11];
  if (typeof elements[245] == "number") analogs[4] = elements[245];
  return analogs;
}

export function getNonFMSorPhysical(
  _elements:
    | Record<number, number | string>
    | { Elements: Record<number, number | string> }
) {
  let elements = hasElements(_elements) ? _elements.Elements : _elements;
  let nonFMSorPhysical: { [id: number]: number | string } = {};
  for (let [key, value] of Object.entries(elements)) {
    let id = Number(key);
    if (Number.isNaN(id))
      throw new Error(
        `Invalid id in 'getNonFMSorPhysical'. Parameter elements: ${JSON.stringify(
          elements
        )}`
      );
    if (isFMSorPhysical(id)) continue;
    nonFMSorPhysical[id] = value;
  }
  return nonFMSorPhysical;
}

function hasElements(
  obj: any
): obj is { Elements: Record<number, number | string> } {
  return obj && obj.Elements;
}

// export function getNotFMSorPhysical(elements: { [id: number]: number | string }) {
//     let elements = isIOelement(_elements) ? _elements.Elements : _elements
//     return getNotFMSorPhysical(elements)
// }

export function isIOelement(obj: any): obj is IOelement {
  return (
    typeof obj === "object" &&
    typeof obj.EventID === "number" &&
    typeof obj.ElementCount === "number"
  );
}

export class IOelement {
  EventID: number;
  ElementCount: number;
  Elements: {
    [avlid: number]: number | string;
  };
  constructor(
    reader: PacketReader<any>,
    on_error: (e: Error) => void,
    codec_id: number
  ) {
    if (reader == null) {
      throw new Error(`Reader not given`);
    }
    if (codec_id == null) {
      throw new Error(`Codec Id not given.`);
    }
    var id_size = codec_id == 0x08 ? 1 : 2;
    this.EventID = reader.read(id_size);
    this.ElementCount = reader.read(id_size);
    var element_value_length = 1;
    this.Elements = {};
    var elements_count = reader.read(id_size);
    let safeSet = (id: number, value: number | string) => {
      if (this.Elements.hasOwnProperty(`${id}`)) {
        throw new Error(`Repeated id '${id}' in IOElement.`);
      }
      this.Elements[id] = value;
    };
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
        safeSet(id, value);
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
      if (codec_id == 0x8e) {
        if (element_value_length != 8) {
          throw new Error(
            `Element value length should be 8. Got ${element_value_length}.`
          );
        }
        elements_count = reader.read(2);
        for (var i = 0; i < elements_count; i++) {
          var id = reader.read(2);
          element_value_length = reader.read(2);
          var value = reader.read(element_value_length);
          safeSet(id, value);
        }
      }
    } catch (e) {
      if (on_error != null) on_error(e);
    }
  }
}
