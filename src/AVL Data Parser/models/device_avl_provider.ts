interface organizedIdElements {
    FMS: Record<number, number | string>;
    [avlId: number]: number | string;
}

interface organizedNameElements {
    FMS: {
        [fmsName: string]: number | string;
    }
    [avlName: string]: number | string | Record<string, number | string>;
}

abstract class DeviceAvlProvider {
    /**
     * The input voltage for the device.
     * This value should be in milivolts like 12000 or 24000.
     * This property affects `castPhysicalAvlToBoolean(number)` calculation.
     */
    abstract get voltage(): number
    abstract get avlIdDic(): Record<number, string>
    abstract get digitalInputIds(): number[]
    abstract get digitalOutputsIds(): number[]
    abstract get analogInputsIds(): number[]
    abstract isFMS(id: number): boolean

    isDigitalInput(id: number) {
        return this.digitalInputIds.includes(id)
    }

    isDigitalOutput(id: number) {
        return this.digitalOutputsIds.includes(id)
    }

    isAnalogInput(id: number) {
        return this.analogInputsIds.includes(id)
    }

    /**
     * Checks if id is an digital input or output
     * @param id avl id
     */
    isDigital(id: number) {
        return this.digitalInputIds.includes(id) || this.digitalOutputsIds.includes(id)
    }

    /**
     * Checks if the avl parameter is an I/O
     * @param id avl id
     */
    isPhysical(id: number) {
        return this.isDigitalInput(id) || this.isAnalogInput(id) || this.isDigitalOutput(id)
    }

    castPhysicalAvlToBoolean(id: number, value: number | boolean, ignoreNonPhysical: boolean = true): boolean | number {
        if (typeof value == 'boolean') {
            return value
        }
        if (this.analogInputsIds.includes(id)) return value > (this.voltage / 2);
        if (this.isDigital(id)) return value == 1;
        if (!ignoreNonPhysical) {
            throw new Error(`Id is not from digital or analog element.`);
        }
        return value
    }

    private _castAvlIdsToAvlNames(elements: Record<number, string | number>) {
        const value: Record<string, number | string> = {}
        const ids = Object.keys(elements)
        for (const id of ids) {
            if (!this.avlIdDic.hasOwnProperty(id)) continue;
            var translated = this.avlIdDic[Number(id)];
            if (translated == null) continue;
            value[translated] = elements[Number(id)]!;
        }
        return value
    }

    castAVLIDtoAVLName(elements: organizedIdElements) {
        var avl_names: organizedNameElements = {
            FMS: {}
        };
        var keys = Object.keys(elements);
        for (const key of keys) {
            if (key == "FMS") {
                var value = elements.FMS
                avl_names["FMS"] = this._castAvlIdsToAvlNames(value);
            } else {
                if (!this.avlIdDic.hasOwnProperty(key)) continue;
                var translated = this.avlIdDic[Number(key)];
                if (translated == null) continue;
                avl_names[translated] = elements[Number(key)]!;
            }
        }
        return avl_names;
    }

}