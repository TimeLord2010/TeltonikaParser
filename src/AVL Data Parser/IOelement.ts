import { PacketReader } from "../PacketReader";

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
