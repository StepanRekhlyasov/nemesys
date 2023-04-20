export interface ReflectLog {
    id: string
    userId: string
    userName: string
    clientFactoryId: string
    executionDate: string
    isUpdated: boolean
    itemType: {
        isBasicInfoChanged: boolean
        isDetailInfoChanged: boolean
    }
}