import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Task {
  id: string,
  taskType: string,
  taskContent: string,
  created_at: Timestamp | FieldValue,
  updated_at: Timestamp | FieldValue,
  taskStatus: 'new' | 'progress' | 'finish',
  taskEntity: 'applicant' | 'office',
  assignedUserId: string,
  assignedUserName: string,
  assignedUserBranchId?: string,
  assignedUserBranchName?: string,
  applicantId?: string,
  applicantName?: string,
  clientId?: string,
  clientName?: string,
  clientFactoryId?: string,
  clientFactoryName?: string,
}