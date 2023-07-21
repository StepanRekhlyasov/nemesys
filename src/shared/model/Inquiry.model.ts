import { FieldValue, Timestamp } from 'firebase/firestore'
import { InquiryMessage } from 'src/pages/admin/InquiryPage/types/inquiryTypes'
import { Organization } from './Organization.model'

export interface InquiryData {
  id: string
  status: string
  category: string
  inquiryContent: string
  organization: string
  recievedDate:  Timestamp
  subject: string
  messages: InquiryMessage[] | never[]
  warning?: string[] | FieldValue
}

export type InquiryDataRow = Partial<InquiryData> & {
  number: number,
  companyID: string
  companyName: string
  issueDate: string
  answerDate: string
  organisation: Organization
}
