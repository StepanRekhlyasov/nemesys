import { Applicant } from 'src/shared/model'

export type ApplicantCol = {
  id: number,
  label: string,
  status: string,
  items: Applicant[] | never[]
}

export type ApplicantProgressFilter = {
  branch: string,
  userInCharge: string,
  prefecture: string,
  currentStatusMonth: string
}

export type ApplicantElasticFilter = {
  all : Record<string, unknown>[]
}
export type ApplicantElasticSearchData = {
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