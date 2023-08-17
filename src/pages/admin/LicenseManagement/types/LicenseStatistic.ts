export interface LicenseStatistic {
  id: string,
  organizationId: string,
  businessId: string,
  branchId: string,
  month: number
  year: number
  count: number
  isFirstDoc?: true //This indicates, is this doc was created at the same time as the branch
}

export interface Search {
  code: string;
  orgaName: string;
  businessName: string;
  branchName: string;
  arroba: boolean;
  nemesys: boolean
}