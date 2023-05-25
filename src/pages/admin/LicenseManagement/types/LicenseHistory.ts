import { Timestamp } from 'firebase/firestore';
import { LicenseRequest } from './LicenseRequest';

export interface LicenseHistory extends LicenseRequest {
  executor: string
  executionTime: Timestamp
}
