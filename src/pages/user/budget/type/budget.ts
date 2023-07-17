import { Timestamp } from 'firebase/firestore';

export interface BudgetData {
  recordNumber?: number | string;
  id?: string;
  accountingMonth: string;
  amount: number | string,
  branch: string;
  media: string;
  numberOfSlots: number | string;
  occupation: string;
  postingEndDate: Timestamp | string;
  postingStartDate: Timestamp | string;
  accountingMonthDate?: Timestamp | string;
  unitPrice: string;
  remark: string;
  agency: string;

}
export interface DateOption {
  label: string, value: number;
}
export interface OptionData {
  occupation: { label: string; value: string; }[];
}
export type selectedYearMonth = number | null
