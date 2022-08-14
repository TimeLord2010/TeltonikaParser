export abstract class DeviceAvlProvider {
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

    abstract get categories(): Record<string, ((id: number) => boolean) | (number | [number, number])[]>

    getCategory(id: number): string | null {
        for (const [category, evaluator] of Object.entries(this.categories)) {
            if (typeof evaluator == 'function') {
                const isFromCategory = evaluator(id)
                if (isFromCategory) return category
            } else {
                for (const item of evaluator) {
                    if (typeof item == 'number') {
                        if (item == id) return category
                    } else {
                        const [start, end] = item
                        if (start >= id && id <= end) return category
                    }
                }
            }
        }
        return null
    }

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

    castAvlIdDicToCategories<T>(elements: Record<number, any>): {
        avlCategories: Record<number, any>,
        extras?: Record<number, any>
    } {
        const avlCategories: Record<string, Record<string, T>> = {}
        let extras: Record<number, any> = {}
        for (const [id, value] of Object.entries(elements)) {
            const _id = Number(id)
            const categoryName = this.getCategory(_id)
            if (categoryName) {
                if (avlCategories[categoryName] == null) {
                    avlCategories[categoryName] = {}
                }
                const avlName = this.avlIdDic[_id]
                if (avlName) {
                    avlCategories[categoryName]![avlName] = value
                }
            } else {
                extras[_id] = value
            }
        }
        if (Object.keys(extras).length == 0) {
            return { avlCategories }
        }
        return { avlCategories, extras }
    }

    castAVLIDtoAVLName<T>(elements: Record<number, T>) {
        const translated: Record<string, T> = {}
        for (const [id, value] of Object.entries(elements)) {
            const _id = Number(id)
            const name = this.avlIdDic[_id]
            if (name) {
                translated[name] = value
            }
        }
        return translated;
    }

}