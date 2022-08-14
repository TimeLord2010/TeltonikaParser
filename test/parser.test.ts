import { Data } from "../src/AVL Data Parser/Data"
import { ProtocolParser } from "../src/ProtocolParser"

test('Packet 1', () => {
    let packet = '000000000000009C080100000176BB09C2CD0005DBE6381B231893006A010B1300000025100100020003010400B300B4003200330016044703F0001504B201C800EF0090010F0900270A000A0B0017F5000A432683440000B50008B6000642620918000046009DCE274DECFC53EDFF9BEEFF1202F1000056C2CD000096F104DA0000D546CACF39A3DB3839343435303233DC3132313930303533DD343733000000000001000013D1'
    expect(() => new ProtocolParser(packet)).not.toThrow()
    let { Quantity1, Content, CodecType } = new ProtocolParser(packet)
    expect(Quantity1).toBe(1)
    expect(CodecType).toEqual('data sending')
    let { AVL_Datas } = Content as Data
    expect(AVL_Datas.length).toEqual(1)
    let [AVL_Data] = AVL_Datas
    let {
        GPSelement: {
            Latitude,
            Longitude,
            Altitude,
            Angle,
            Satellites,
            Speed
        },
        IOelement: {
            Elements,
            ElementCount
        },
        Timestamp
    } = AVL_Data!
    expect(Timestamp).toBeInstanceOf(Date)
    expect(Timestamp.toISOString()).toBe('2020-12-31T23:02:27.789Z')
    expect(Altitude).toEqual(106)
    expect(Angle).toEqual(267)
    expect(Satellites).toEqual(19)
    expect(Speed).toEqual(0)
    expect(Longitude).toBeCloseTo(9.8297400)
    expect(Latitude).toBeCloseTo(45.5284883)
    expect(ElementCount).toEqual(37)
    expect(Elements[1]).toEqual(0)
    expect(Elements[3]).toEqual(1)
    expect(Elements[11]).toEqual(23)
    expect(Elements[66]).toEqual(25097)
    expect(Elements[206]).toEqual(10061)
    expect(Elements[221]).toEqual('3762532088784355328')
})

test('Packet 2', () => {
    let packet = '00000000000000628e010000017a52dc444800c42dd67b0c443bce000000000000000000000c000500f00100150200c800004502007143000500b5000000b600000018000000430f1d00440000000100f1000518c400000001037b000c44444245353930444442353801000001f2'
    expect(() => new ProtocolParser(packet)).not.toThrow()
    let { Quantity1, Content, CodecType } = new ProtocolParser(packet)
    expect(Quantity1).toBe(1)
    expect(CodecType).toEqual('data sending')
    let { AVL_Datas } = Content as Data
    expect(AVL_Datas.length).toEqual(1)
    let [AVL_Data] = AVL_Datas
    let {
        GPSelement: {
            Latitude,
            Longitude,
            Altitude,
            Angle,
            Satellites,
            Speed
        },
        IOelement: {
            Elements,
            ElementCount
        },
        Timestamp
    } = AVL_Data!
    expect(Timestamp).toBeInstanceOf(Date)
    expect(Timestamp.toISOString()).toBe('2021-06-28T13:43:25.000Z')
    expect(Altitude).toEqual(0)
    expect(Angle).toEqual(0)
    expect(Satellites).toEqual(0)
    expect(Speed).toEqual(0)
    expect(Longitude).toBeCloseTo(-100.3628933)
    expect(Latitude).toBeCloseTo(20.5798350)
    expect(ElementCount).toEqual(12)
    expect(Elements[21]).toEqual(2)
    expect(Elements[113]).toEqual(67)
    expect(Elements[182]).toEqual(0)
    expect(Elements[241]).toEqual(334020)
})