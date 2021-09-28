

export interface SingleReportConfiguration {
    id: string,
    name: string,
    program: string[],
    dxConfigs: DxConfig[],
    disablePeriodSelection: boolean,
    allowedImplementingPartners: string[],
    includeEnrollmentWithoutService: boolean,
    disableOrgUnitSelection?: boolean
}

interface DxConfig {
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



export class MetadataValidate implements SingleReportConfiguration {

    constructor(
        readonly id: string,
        readonly name: string,
        readonly program: string[],
        readonly dxConfigs: DxConfig[],
        readonly disablePeriodSelection: boolean,
        readonly allowedImplementingPartners: string[],
        readonly includeEnrollmentWithoutService: boolean,
        readonly disableOrgUnitSelection?: boolean,) {

    }


}

