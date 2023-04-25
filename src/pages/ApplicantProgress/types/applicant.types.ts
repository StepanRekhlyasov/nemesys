import { Applicant } from 'src/shared/model'

export type ApplicantCol = {
  id: number,
  label: string,
  status: string,
  items: Applicant[] | never[]
}
