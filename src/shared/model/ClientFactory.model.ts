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
}