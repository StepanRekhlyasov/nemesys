
export interface Branch {
  id: number;
  name: string;
  prefectures: string;
  phone?: string;
  flug: string;
  hidden: boolean;
  createAt: Date;
  updateAt?: Date;
  deletedAt?: Date;
}
