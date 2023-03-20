export interface Organization {
  id: string;
  name: string;
  staff_name: string;
  tel: string;
  fax: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
  mailaddress: string;
  code: string;
  operatorUser: string; //担当者
  invoiceRequest: InvoiceRequest;
  working: boolean
  deleted: boolean
}

type InvoiceRequest = typeof invoiceRequests[number]

export const invoiceRequests = ['electronic'] as const

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
