import { graphType } from '../types/totalization';
import { typeOfQuery } from '../types/totalization';
import { User, Branch } from 'src/shared/model';
import { Media } from 'src/shared/model/Media.model';
import { QueryFieldFilterConstraint } from 'firebase/firestore';
export interface ReportState {
  dateRange: { from: string; to: string };
  dateType: graphType;
  media?: string;
  branch?: string;
  uid?: string;
  organizationId?: string;
}

export interface reportStateAndOthers {
  reportState: ReportState;
  isAverage:boolean;
  queryNames: Readonly<typeOfQuery[]>;
}

export interface basedReportState {
  dateRange: { from: string; to: string };
  graphType: graphType;
  queryNames: Readonly<typeOfQuery[]>;
  organizationId?: string;
  isAverage: boolean;
  rateNames?:Readonly<Readonly<string[]>[]>
}

export interface mediaBasedReportState extends basedReportState {
  media: string;
  branches: Branch[];
}

export interface branchBasedReportState extends basedReportState {
  medias: Media[];
  branch: string;
}

export interface userBasedReportState extends basedReportState {
  users: User[];
}

export interface dailyBasedReportState extends basedReportState {
  dateInMonth: string;
  branch: string;
}

export interface FieldDict {
  readonly name: string;
  readonly rateName?: string;
  readonly dateBasedOnEachItemDate: string;
  readonly dateBasedOnLeftMostItemDate: string;
  readonly filters: QueryFieldFilterConstraint[];
  readonly collection: string;
  readonly branchField?: string;
  readonly mediaField: string;
  readonly uidField?: string;
  readonly occupationField?: string;
}
