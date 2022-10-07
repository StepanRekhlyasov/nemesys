
export interface Branch {
  id: number;
  name: string;
  prefectures: string;
  phone?: string;
  flug: string;
  hidden: boolean;
  create_at: Date;
  last_update: Date;
}
