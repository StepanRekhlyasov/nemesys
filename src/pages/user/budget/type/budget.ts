import { Timestamp } from 'firebase/firestore';

export interface BudgetData {
  recordNumber?: number | string | null;
  id?: string;
  accountingMonth: string;
  amount: number | string | null,
  branch: string;
  media: string;
  numberOfSlots: number | string | null;
  occupation: string;
  postingEndDate: Timestamp | string;
  postingStartDate: Timestamp | string;
  accountingMonthDate?: Timestamp | string;
  unitPrice: string | number | null;
  remark: string;
  agency: string;
  organizationId: string;
}
export interface DateOption {
  label: string, value: number;
}
export interface OptionData {
  occupation: { label: string; value: string; }[];
}
export type selectedYearMonth = number | null
