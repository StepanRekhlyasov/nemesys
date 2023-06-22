import {
  collection,
  query,
  getFirestore,
  getDocs,
  where,
  QueryFieldFilterConstraint,
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Timestamp } from 'firebase/firestore';

interface Budget {
  metadata: {
    id: string;
    created_at: Timestamp;
    updated_at: Timestamp;
  };
  media: string;
  organization_id: string;
  branch_id: string;
  start_at: Timestamp;
  end_at: Timestamp;
  record_year: number;
  record_month: number;
  budget_amount: number;
  quota_number: number;
  unit_cost: number;
  agent_name: string;
  note: string;
  number_of_applicants: number;
  number_of_admission: number;
}

export const useBudget = defineStore('budget', () => {
  const db = getFirestore();
  const monthPerYear = 12;
  const getUnitPricePerOrganization = async (
    dateRangeProps?: { from: string; to: string },
    organization_id?: string,
    beforeMonth = 7
  ) => {
    const mediaRef = collection(db, 'budget');
    const filters: QueryFieldFilterConstraint[] = [];
    const filters_: QueryFieldFilterConstraint[] = [];

    if (organization_id !== undefined) {
      filters.push(where('organization_id', '==', organization_id));
    }
    //dateRangeProps is like {from:1900/01/01,to:1900/12/01}
    if (dateRangeProps === undefined) return;
    const toMonth = dateRangeProps.to.split('/')[1];
    const year = dateRangeProps.to.split('/')[0];

    //get month from before 7 month
    const fromMonth = Number(toMonth) - beforeMonth + 1;

    filters.push(where('record_year', '==', Number(year)));
    filters.push(where('record_month', '<=', Number(toMonth)));
    filters.push(where('record_month', '>=', Number(fromMonth)));
    if (fromMonth <= 0) {
      filters_.push(where('record_year', '==', Number(year) - 1));
      filters_.push(where('record_month', '>=', Number(fromMonth) + 12));
    }
    const querys = query(mediaRef, ...filters);
    const docSnap = await getDocs(querys);
    const querys_ = query(mediaRef, ...filters_);
    const docSnap_ = await getDocs(querys_);

    const budget_amount: number[] = [];
    budget_amount.length = beforeMonth;
    budget_amount.fill(0);

    const number_of_applicants: number[] = [];
    number_of_applicants.length = beforeMonth;
    number_of_applicants.fill(0);

    const number_of_admission: number[] = [];
    number_of_admission.length = beforeMonth;
    number_of_admission.fill(0);

    for (const doc of [...docSnap.docs, ...docSnap_.docs]) {
      const budget = doc.data() as Budget;
      let index: number;
      if (Number(toMonth) - doc.data().record_month < 0) {
        index =
          -Number(toMonth) + doc.data().record_month - monthPerYear + beforeMonth - 1;
      } else {
        index = -Number(toMonth) + doc.data().record_month + beforeMonth - 1;
      }
      budget_amount[index] += budget.budget_amount;
      number_of_applicants[index] += budget.number_of_applicants;
      number_of_admission[index] += budget.number_of_admission;
    }

    const unitpricePerApplicants: number[] = [];
    unitpricePerApplicants.length = beforeMonth;
    unitpricePerApplicants.fill(0);

    const unitpricePerAdmission: number[] = [];
    unitpricePerAdmission.length = beforeMonth;
    unitpricePerAdmission.fill(0);

    for (let i = 0; i < beforeMonth; i++) {
      if (number_of_applicants[i] === 0) continue;
      if (number_of_admission[i] === 0) continue;
      unitpricePerApplicants[i] = budget_amount[i] / number_of_applicants[i];
      unitpricePerAdmission[i] = budget_amount[i] / number_of_admission[i];
    }
    return [unitpricePerApplicants, unitpricePerAdmission];
  };

  const getUnitPricePerOrganizationPerMedia = async (
    media_list: string[],
    dateRangeProps?: { from: string; to: string },
    organization_id?: string,
  ) => {
    const mediaRef = collection(db, 'budget');
    const filters: QueryFieldFilterConstraint[] = [];
    if (organization_id) {
      filters.push(where('organization_id', '==', organization_id));
    }
    //dateRangeProps is like {from:1900/01/01,to:1900/12/01}
    if (!dateRangeProps) return;
    const toMonth = dateRangeProps.to.split('/')[1];
    const year = dateRangeProps.to.split('/')[0];
    filters.push(where('record_year', '==', Number(year)));
    filters.push(where('record_month', '==', Number(toMonth)));
    const querys = query(mediaRef, ...filters);
    const docSnap = await getDocs(querys);
    //budget_amount and number_of_applicants is like [0,0,0,0,0,0,0]
    const budget_amount: number[] = [];
    budget_amount.length = media_list.length;
    budget_amount.fill(0);
    const number_of_applicants: number[] = [];
    number_of_applicants.length = media_list.length;
    number_of_applicants.fill(0);

    for (const doc of docSnap.docs) {
      const budget = doc.data() as Budget;
      if (!media_list.includes(doc.data().media)) continue;
      const index = media_list.indexOf(doc.data().media);
      budget_amount[index] += budget.budget_amount;
      number_of_applicants[index] += budget.number_of_applicants;
    }
    const unitpricePerApplicants: number[] = [];
    unitpricePerApplicants.length = media_list.length;
    unitpricePerApplicants.fill(0);
    const unitpricePerAdmission: number[] = [];
    unitpricePerAdmission.length = media_list.length;
    unitpricePerAdmission.fill(0);
    for (let i = 0; i < media_list.length; i++) {
      if (number_of_applicants[i] === 0) continue;
      unitpricePerApplicants[i] = budget_amount[i] / number_of_applicants[i];
    }
    return unitpricePerApplicants;
  };
  return { getUnitPricePerOrganization, getUnitPricePerOrganizationPerMedia };
});
