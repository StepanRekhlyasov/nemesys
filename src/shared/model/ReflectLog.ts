export interface ReflectLog {
    id: string
    userId: string
    clientFactoryId: string
    executionDate: string
    isUpdated: boolean
    itemType: {
        isBasicInfoChanged: boolean
        isDetailInfoChanged: boolean
    }
}