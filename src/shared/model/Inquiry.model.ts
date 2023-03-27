import { FieldValue } from 'firebase/firestore'
import { InquiryMessage } from 'src/pages/admin/InquiryPage/types/inquiryTypes'
import { Organization } from './Organization.model'

export interface InquiryData {
  id: string
  status: string
  category: string
  inquiryContent: string
  organization: string
  recievedDate:  FieldValue | Date
  subject: string
  messages: InquiryMessage[] | never[]
}

export type InquiryDataRow = Partial<InquiryData> & {
  number: number,
  companyID: string
  issueDate: string
  answerDate: string
  organisation: Organization
}
