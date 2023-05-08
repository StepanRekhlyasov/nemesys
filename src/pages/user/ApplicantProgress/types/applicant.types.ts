import { Applicant } from 'src/shared/model'

export type ApplicantCol = {
  id: number,
  label: string,
  status: string,
  items: Applicant[] | never[]
}

export type ApplicantFilter = {
  branch: string,
  userInCharge: string,
  prefecture: string,
  currentStatusMonth: string
}