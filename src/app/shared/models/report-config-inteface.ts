

export interface DxConfig {
    id: string,
    name: string,
    isDate: boolean,
    isBoolean: boolean,
    isAttribute: boolean,
    programStage: string,
    codes?: string[],
    displayValues?: DisplayValue[]
}
interface DisplayValue {
    value: string,
    displayName: string
}



