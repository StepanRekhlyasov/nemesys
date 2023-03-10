import { NotificationData } from 'src/shared/model'

export enum DELIVERY_STATUS {
  'not delivered',
  'delivered'
 }

export type NotificationDataRow = Omit<NotificationData, 'dateCreation' | 'dateDelivery'> & {
  number: number
  id: string
  creationDate: string
  deliveryDate: string
}
