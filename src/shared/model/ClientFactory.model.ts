import { ReflectLog } from './ReflectLog'
import { ImportLog } from './ImportLog'

enum Industry {
    Care = 'care',
    Nurse = 'nurse'
}

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
    existingOfficeFlag: boolean
    numberEmployees: number
    clientFlag: boolean
    basicInfoChangingFlag: boolean
    mail: string
    isSignedDispatchContract: boolean;
    isSignedReferralContract: boolean;
    nameContact: string;
    telContact: string;
    positionContact: string;
    mailContact: string;
    officeDetails: OfficeDetails
    reflectLog?: ReflectLog;
    importLog?: ImportLog
}

interface OfficeDetails {
    registeredInfo: {
        prefecture: string
        officeName: string
        parentClient: string
        city: string
        tel: string
        townAndStreet: string
        fax: string
        others: string
        latitude: number
        longitude: number
    },
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
    },
    uniqueItems: {
        [key: string]: string
    }
}