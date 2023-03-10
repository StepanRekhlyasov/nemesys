import { FieldValue } from 'firebase/firestore'

export interface NotificationData {
  status: string
  category: string
  subject: string
  content: string
  author: string
  dateCreation: FieldValue
  dateDelivery: FieldValue | Date
}
