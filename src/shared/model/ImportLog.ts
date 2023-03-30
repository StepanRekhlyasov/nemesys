export interface ImportLog {
    userId: string
    clientFactoryId: string
    organizationId: string
    executionDate: string
    isUpdated: boolean
    itemType: {
        isBasicInfoChanged: boolean
        isDetailInfoChanged: boolean
    }
}