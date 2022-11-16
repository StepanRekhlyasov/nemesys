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
