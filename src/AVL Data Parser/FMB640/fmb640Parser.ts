import { DeviceAvlProvider } from '../models/device_avl_provider'
import { avlidDictionary } from './avlDict'

export class FMB640Parser extends DeviceAvlProvider {
    get categories(): Record<string, ((id: number) => boolean) | (number | [number, number])[]> {
        return {
            FMS: (id: number) => this.isFMS(id),
            DigitalInputs: (id: number) => this.isDigitalInput(id),
            DigitalOutputs: (id: number) => this.isDigitalOutput(id),
            AnalogInputs: (id: number) => this.isAnalogInput(id),
        }
    }

    private _voltage: number

    constructor(maxVoltage: number = 12) {
        super()
        this._voltage = maxVoltage
    }

    get voltage(): number {
        return this._voltage
    }
    get avlIdDic(): Record<number, string> {
        return avlidDictionary
    }
    get digitalInputIds(): number[] {
        return [1, 2, 3, 4]
    }
    get digitalOutputsIds(): number[] {
        return [179, 180, 50, 51]
    }
    get analogInputsIds(): number[] {
        return [9, 10, 11, 245]
    }

    isFMS(id: number): boolean {
        return (id >= 79 && id <= 113) ||
            (id >= 122 && id <= 128) ||
            (id >= 135 && id <= 139) ||
            (id >= 10348 && id <= 10431)
    }

}