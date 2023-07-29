import { ReflectLog } from './ReflectLog'
import { ImportLog } from './ImportLog'
import { Client } from './Client.model'
export interface ClientFactory {
    id: string
    industry: string[]
    isHead: boolean
    name: string
    clientID: string
    lat: number
    lon: number
    distance: number
    address: string
    prefecture: string
    municipality: string
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
    geohash?: string;

    client?: Client

    draft: Partial<ClientFactory> | Record<string, never>
}

type OfficeDetails = {
    [key: string]: {
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


            commutingByCar: string
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
} & {
    registeredInfo: {
        parentClient: string
        tel: string
        street: string
        building: string
        fax: string
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