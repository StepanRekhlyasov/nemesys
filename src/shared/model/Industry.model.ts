export interface Industry {
    industryName: string
    uniqueItems: {
        typeSpecificItems: Array<{id: string; title: string; dataType: string}> | []
        facilityForms: Array<{id: string; title: string}> | []
    }
}