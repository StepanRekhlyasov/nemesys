import { FieldValue } from 'firebase/firestore'
import { Organization } from './Organization.model'

export interface InquiryData {
  id: string
  status: string
  category: string
  inquiryContent: string
  organization: string
  recievedDate:  FieldValue | Date
  subject: string
  responseDate?: FieldValue | Date
  responseContent?: string
}

export interface InquiryResponseData {
  replyDate:  FieldValue | Date
  replyContent: string
}

export type InquiryDataRow = Partial<InquiryData> & {
  number: number,
  companyID: string
  issueDate: string
  answerDate: string
  organisation: Organization
}
