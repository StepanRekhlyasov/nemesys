import { ReflectLog } from './ReflectLog'
import { ImportLog } from './ImportLog'
import { Client } from './Client.model'
export interface ClientFactory {
    id: string
    industry: Industry
    isHead: boolean
    name: string
    clientID: string
    lat: number
    lon: number
    distance: number
    address: string
    fax: string
    tel: string
    homepageUrl: string
    isFaxNG: boolean
    facilityType: string[]
    existingOfficeFlag?: boolean
    numberEmployees: string
    clientFlag: boolean
    basicInfoChangingFlag: boolean
    mail: string
    isSignedDispatchContract: boolean;
    isSignedReferralContract: boolean;
    nameContact: string;
    telContact: string;
    positionContact: string;
    mailContact: string;
    updated_at: string;
    created_at: string;
    officeDetails?: OfficeDetails;
    contractInfo?: ContractInfo;
    reflectLog?: ReflectLog;
    importLog?: ImportLog;

    client?: Client

    draft: Partial<ClientFactory> | Record<string, never>
}

export type Industry = Array<'nurse' | 'nursing'>

type OfficeDetails = {
    [key in Industry[number]]: {
        commonItems: {
            referralFeePer: number
            referralFeeFix: number
            salaryHour: number
            salaryMonth: number
            salaryAdditional: string
            payday: string
            disabilityTime: string
            yearFixed: string
            welfareHealth: string
            leisureSpecial: string
            contentWork: string
            canSmoke: boolean
            dayOffYear: string
            dayOffWeek: string
            workingHourEarly: string
            workingHourDay: string
            workingHourLate: string
            workingHourNight: string
        }
        uniqueItems: {
            [key: string]: string
        }
    }
} | {
    commonItems: {
        referralFeePer: number
        referralFeeFix: number
        salaryHour: number
        salaryMonth: number
        salaryAdditional: string
        payday: string
        disabilityTime: string
        yearFixed: string
        welfareHealth: string
        leisureSpecial: string
        contentWork: string
        canSmoke: boolean
        dayOffYear: string
        dayOffWeek: string
        workingHourEarly: string
        workingHourDay: string
        workingHourLate: string
        workingHourNight: string
    }
    uniqueItems: {
        [key: string]: string
    }
} & {
    registeredInfo: {
        prefecture: string
        officeName: string
        parentClient: string
        municipality: string
        city: string
        tel: string
        street: string
        building: string
        fax: string
        others: string
        latitude: number
        longitude: number
    }
}

interface ContractInfo {
    contractUnit: string;
    industry: string[]
    contractTel: string;
    contractFax: string;
    contractMail: string;
    contractPerson: string;
}