import { User } from 'firebase/auth';

export interface ClientMemo {
  id?: string;
  created_user: string;
  content: string;
  created_date: string;
  updated_date?: string;
  delited: boolean;
  user?: User;
  displayName?: string;
}

export interface Client {
  id?: string;
  clientId: string;
  client_name?: string;
  companyProfile?: string;
  conclusionContract?: boolean;
  conclusionDispatchContract?: boolean;
  conclusionReferralContract?: boolean;
  contractUnit?: string;
  created_at: string;
  deleted: boolean;
  earnings?: string;
  facilityType?: string[];
  fax?: string;
  flg_faxng?: boolean;
  geohash?: string;
  homePage?: string;
  lat?: number;
  lon?: number;
  mailaddress?: string;
  municipality?: string;
  name: string;
  capital: string;
  established: string;
  numberEmployees?: string;
  numberOffices?: string;
  prefecture?: string;
  representativeName?: string;
  street?: string;
  tel?: string;
  updated_at: string;
  nursing: string[];
  headquarter: string;
  office?: ClientOffice[];
}

export interface ClientOffice {
  id?: string;
  updated_at: string;
  created_at: string;
  deleted: boolean;
  companyProfile?: string;
  conclusionContract?: boolean;
  conclusionDispatchContract?: boolean;
  conclusionReferralContract?: boolean;
  contractUnit?: string;
  earnings?: string;
  facilityType?: string[];
  fax?: string;
  flg_faxng?: boolean;
  geohash?: string;
  homePage?: string;
  lat?: number;
  lon?: number;
  mailaddress?: string;
  municipality?: string;
  name: string;
  numberEmployees?: string;
  prefecture?: string;
  representativeName?: string;
}