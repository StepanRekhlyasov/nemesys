import { FieldValue, Timestamp } from 'firebase/firestore'

export interface NotificationData {
  id?: string
  warning?: string[] | FieldValue
  status: string
  category: string
  subject: string
  content: string
  inquiryContent?: string
  author: string
  dateCreation: FieldValue
  dateDelivery: FieldValue | Date
  recievedDate?: Timestamp
}
