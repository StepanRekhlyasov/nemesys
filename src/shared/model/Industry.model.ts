export interface Industry {
    id: string
    industryName: string
    uniqueItems: {
        typeSpecificItems: Array<SpecificItem>
        facilityForms: Array<FacilityForm>
    }
}

export interface SpecificItem {
    id: string;
    title: string;
    dataType: string
}

export interface FacilityForm {
    id: string;
    title: string
}