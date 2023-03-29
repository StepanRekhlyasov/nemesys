export interface ReflectLog {
    userId: string
    clientFactoryId: string
    executionDate: string
    isUpdated: boolean
    itemType: {
        isBasicInfoChanged: boolean
        isDetailInfoChanged: boolean
    }
}