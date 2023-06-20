import { ClientFactory } from './ClientFactory.model'

export interface ModifiedCF extends ClientFactory {
    organizationId: string
    isIgnored: boolean
    numberUpdates: number
    numberImports: number
}