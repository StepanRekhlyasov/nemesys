import { FieldValue } from 'firebase/firestore'

export enum INQUIRY_STATUS {
  'answered',
  'unanswered'
 }

export enum INQUIRY_MESSAGE_TYPE {
  'issue',
  'response'
}

export type InquiryMessage = {
  date: FieldValue | Date
  messageDate?: string,
  content: string
  type: INQUIRY_MESSAGE_TYPE.issue | INQUIRY_MESSAGE_TYPE.response
}
