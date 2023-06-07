import { Branch, Business, Organization } from 'src/shared/model'
import { ElementOf } from 'src/shared/types/ElementOf'
import { mapOrganizationsToRow } from '../handlers/handlers'

export type Rows = Awaited<ReturnType<typeof mapOrganizationsToRow>>

export type Row = ElementOf<Rows>

export interface Table {
  organization: OrganizationItem[]
}

interface OrganizationItem extends Organization {
  totalBranches: number,
  organizationCodeAndName?: string,
  working: boolean,
  buisneses: Buisneses[]
}

export interface Buisneses extends Business {
  branches: Branch[]
}

export type DialogType = 'Organization' | 'Branch' | 'Business'

interface UserAvailability {
  enabled: boolean,
}

interface OrganizationAvailability extends UserAvailability {
  organizationId: string
  branchId?: never
}

interface BranchAvailability extends UserAvailability {
  branchId: string
  organizationId?: never
}

export type Availability = BranchAvailability | OrganizationAvailability

export type AvailabilityApi = Availability & {
  userId: string
  idToken: string
}
