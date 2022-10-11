import { Branch } from './Branch.model';

export interface Accaunt {
  email: string;
  person_name: string;
  branch: Branch;
  manager: boolean;
  hidden: boolean;
  create_at: Date;
  last_update: Date;
}
