import { mapOrganizationsToRow } from '../handlers/handlers'

export type Rows = Awaited<ReturnType<typeof mapOrganizationsToRow>>

export type ElementOf<T> = T extends Array<infer U> ? U : never

export type Row = ElementOf<Rows>
