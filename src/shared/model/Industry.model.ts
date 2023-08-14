export interface Industry {
    id: string,
    industryName: string
    uniqueItems: {
        typeSpecificItems: {[key: string]: SpecificItem}
        facilityForms: {[key: string]: FacilityForm}
        occupationForms: {[key: string]: OccupationForm}
        certificateForms: {[key: string]: CertificateForm}
    }
}

export interface SpecificItem {
    title: string
    dataType: string
    order: number
}

export interface FacilityForm {
    title: string
    order: number
}

export interface OccupationForm {
    title: string
    order: number
}

export interface CertificateForm {
    title: string
    order: number
}
