import { ClientFactory } from './ClientFactory.model'

export interface ModifiedCF extends ClientFactory {
    organizationId: string
}