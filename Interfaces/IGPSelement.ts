export interface IGPSelement {
    Longitude : string | number,
    Latitude : string | number,
    Altitude : number,
    Angle : number,
    Satellites : number,
    Speed : number
}

export function isIGPSelement (obj: any) : obj is IGPSelement {
    return obj && typeof obj.Angle === 'number' && typeof obj.Speed === 'number' && ['string', 'number'].includes(typeof obj.Latitude)
}

export interface IpoiMov extends IGPSelement {
    Timestamp : Date
}

export interface IpoiStop extends IGPSelement {
    Timestamp: Date,
    IdInstallation : number,
    DeviceIMEI: string,
    StopDuration : number
    MovDuration : number,
    MovDistance : number,
    POImov: IpoiMov[],
    POImatch: number[] // AOI
}