export function toHex(str: string) {
    let hexDataList: string[] = []
    for (let i = 0; i < str.length; i++) {
        hexDataList.push(str.charCodeAt(i).toString(16).padStart(2, '0'))
    }
    return hexDataList.join('')
}

export function hexToAscII(str: string) {
    let ascIIList: string[] = []
    for (let i = 0; i < str.length; i += 2) {
        let byte = str.substring(i, 2)
        ascIIList.push(String.fromCharCode(parseInt(byte, 16)))
    }
    return ascIIList.join('')
}

export function splitAt(str: string, ...extraIndexes: number[]): string[] {
    if (str == null || str.length == 0) throw new Error(`Invalid string to split.`)
    if (extraIndexes.length == 0) throw new Error(`Must split at least once.`)
    let i = extraIndexes[0]!
    let rest = extraIndexes.slice(1)
    if (i < 0) {
        i += str.length
    }
    if (rest.length == 0) {
        return [str.slice(0, i), str.slice(i)]
    } else {
        return [str.slice(0, i), ...splitAt(str.slice(i), ...rest)]
    }
}