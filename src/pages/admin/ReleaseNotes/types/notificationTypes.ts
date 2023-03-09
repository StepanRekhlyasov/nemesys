export enum DELIVERY_STATUS {
  'not delivered',
  'delivered'
 }

export type NotificationDataRow = {
  number: number
  id: string
  status: string
  category: string
  subject: string
  content: string
  author: string
  creationDate: string
  deliveryDate: string
}
