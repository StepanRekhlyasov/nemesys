export interface ImportLog {
    id: string
    userId: string
    userName: string
    clientFactoryId: string
    organizationId: string
    organizationName: string
    executionDate: string
    isUpdated: boolean
    itemType: {
        isBasicInfoChanged: boolean
        isDetailInfoChanged: boolean
    }
}