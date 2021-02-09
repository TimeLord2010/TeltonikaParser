# TeltonikaParser

Install this parser using npm: `npm i complete-teltonika-parser`

```javascript
const { ProtocolParser, parseIMEI } = require('complete-teltonika-parser')
const packet = '00000000000000fd8e0100000176169220e000067673631b1ab6be008f00000f000000000031001800010000020000030100040000b30000b40000320000330000160400470300f00000150300c80000ef00009001004fff0051ff0052ff0053ff0055ff006e01007aff007fff286cff000d00090028000a0036000b003500f50027004327540044000000425c80001800000046009500ecfffd00edffe500ee03d00080ffff00080050ffffffff0054ffffffff0056ffffffff0057ffffffff0058ffffffff0068ffffffff0071ffffffff0087ffffffff000400da0000d546ca81f6ac00db383934343530323700dc303631393934313900dd3332320000000000000001000089fb'
let parsed = new ProtocolParser(packet)
console.log(parsed)

const imei = parseIMEI('000F333532303933303839313638383231')
console.log(imei)

```

Q: How can I know that a packet is the device imei or the data packet?

A: The packet containing the imei has a constant length: 34

```
function processPacket (packet) {
    if (packet.length == 34) {
        return {
            imei: parseIMEI(packet)
        }
    } else {
        return { 
            dataPacket: new ProtocolParser(packet)
        }
    }
}
```

ProtocolParser has the following signature:

```typescript
class ProtocolParser {
    Packet : string
    Preamble: number
    Data_Length: number
    CodecID: number
    Quantity1: number
    CodecType: 'data sending' | 'GPRS messages'
    Content : GPRS | Data | null
    Quantity2: number
    CRC: number
    constructor(packet: string, basic_read: boolean, on_ioElement_error: (e: Error) => void) {
      // code
    }
}

class Data {
  AVL_Datas : AVL_Data[]
}

class AVL_Data  {
    Timestamp : Date
    Priority : number
    GPSelement : GPSelement
    IOelement : IOelement
}

class GPSelement {
    Longitude : number,
    Latitude : number,
    Altitude : number,
    Angle : number,
    Satellites : number,
    Speed : number
}

class IOelement {
    EventID: number
    ElementCount: number
    Elements: {
        [avlid: number]: number | string
    }
}

class GPRS {
    type : 5 | 6
    isResponse : boolean
    responseStr : string
}
```

Where if `basic_read == true`, then the property 'Content' will not be parsed.

Notice that values from IOelement.Elements can also be string. Thats because some values may be too bit to fit javascript's number type. To ilustrate that, here is the actual code to extract the value:
```typescript
function extractValue (x: string) => {
  var y: number | string = parseInt(x, 16);
  if (y > Number.MAX_SAFE_INTEGER) {
    y = BigInt(`0x${x}`).toString();
  }
  return y;
}
```
## NOTICE

- If the data packet has an invalid CRC, then the parser will fail throwing an exception;
- This is a PROTOCOL parser. It does not parse the device IMEI. For that, use the function parseIMEI;
- The file "AVL Data Parser/IOelement" has some useful funcitons and an avl id translator for teltonika device model FMB640.
