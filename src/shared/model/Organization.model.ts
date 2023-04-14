import { Timestamp } from 'firebase/firestore';

export interface Organization {
  id: string;
  name: string;
  staff_name?: string;
  tel: string;
  fax: string;
  deletedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  mailaddress: string;
  code: string; //must be unique
  operatorUser: string; //担当者
  invoiceRequest: InvoiceRequest;
  working: boolean
  deleted: boolean
}

export type InvoiceRequest = typeof invoiceRequests[number]

export const invoiceRequests = ['electronic', 'mail'] as const

export enum Prefectures {
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県'
}
