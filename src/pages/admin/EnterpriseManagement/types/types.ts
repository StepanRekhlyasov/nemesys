import { Branch } from 'src/shared/model'
import { mapOrganizationsToRow } from '../handlers/handlers'

export type Rows = Awaited<ReturnType<typeof mapOrganizationsToRow>>

export type ElementOf<T> = T extends Array<infer U> ? U : never

export type Row = ElementOf<Rows>

export interface Table {
  organization: {
    totalBranches: number,
    organizationIdAndName: string,
    working: boolean,
    buisneses: Buisneses[]
  }[]
}

export type Buisneses = {
  working: boolean,
  name: string,
  branches: Branch[]
}

export type DialogType = 'Organization' | 'Branch' | 'Business'
