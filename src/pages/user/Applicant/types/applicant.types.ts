import { Applicant, ApplicantFix } from 'src/shared/model'

export type ApplicantCol = {
  id: number,
  label: string,
  status: string | string[],
  items: Applicant[] | never[] | ApplicantFix[]
}

export type ApplicantProgressFilter = {
  branchIncharge: string,
  userInCharge: string,
  prefecture: string,
  currentStatusMonth: string,
  organizationId?: string
}

export type ApplicantElasticFilter = {
  all : Record<string, unknown>[]
}
export type ApplicantElasticSearchData = {
  keyword?: string,
  applicationDateMin?: string,
  applicationDateMax?: string,
  ageMin?: string,
  ageMax?: string,
  workPerWeekMin?: string,
  workPerWeekMax?: string,
  availableShift?: string[],
  mapData?: {
    lat?: string,
    lng?: string,
    radiusInM?: string,
  }
}
