import {
  collection,
  query,
  where,
  getFirestore,
  getCountFromServer,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';

const applicant_db = [
  'applicants',
  'valid_applicants',
  'contact_applicants',
  'attraction_applicants',
  'attend_applicants',
];

const fix_db = ['fix', 'inspection', 'offer', 'admission'];

const bo_db = ['bo','bo_isfirst','bo_isnotfirst'];
const filters_dict = {
  applicants: [],
  valid_applicants: [],
  contact_applicants: [where('contactStatus', '==', true)],
  attraction_applicants: [where('attractionStatus', '==', true)],
  attend_applicants: [where('attendStatus', '==', true)],
  fix: [where('status', '==', 'ok')],
  inspection: [where('inspectionStatus', '==', 'ok')],
  offer: [where('offerStatus', '==', 'ok')],
  admission: [where('admissionStatus', '==', 'ok')],
  bo: [],
  bo_isfirst:[where('is_first','==',true)],
  bo_isnotfirst:[where('is_first','==',false)],
};

const date_dict: { [key: string]: string } = {
  applicants: 'applicationDate',
  valid_applicants: 'applicationDate',
  contact_applicants: 'applicationDate',
  attraction_applicants: 'applicationDate',
  attend_applicants: 'applicationDate',
  fix: 'data',
  inspection: 'inspectionDate',
  offer: 'offerDate',
  admission: 'admissionDate',
  bo: 'created_at',
  bo_isfirst: 'created_at',
  bo_isnotfirst: 'created_at',
};

export const Totalizer = async (
  dateRange: { from: string; to: string },
  item_list: string[],
  is_average = false,
  organization_id: string | undefined = undefined,
  target: { [key: string]: string } | undefined = undefined,
  ignore_fix = false
): Promise<number[]> => {
  const db = getFirestore();
  const data_average: number[] = Array(item_list.length).fill(0);
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  let number_of_member = 1;
  if (is_average) {
    const filter_ =
      organization_id == undefined
        ? []
        : [where('organization_ids', 'array-contains', organization_id)];
    number_of_member = (
      await getCountFromServer(query(collection(db, 'users'), ...filter_))
    ).data().count;
    console.log(number_of_member)
  }
  for (const [index, item] of Object.entries(item_list)) {
    const filter = [...filters_dict[item]];
    if (target == undefined) {
      filter.push(where(date_dict[item], '>=', targetDateFrom));
      filter.push(where(date_dict[item], '<=', targetDateTo));
    }
    let ref: CollectionReference<DocumentData>;
    if (applicant_db.includes(item)) {
      ref = collection(db, 'applicants');
      if (target != undefined) {
        filter.push(
          where(date_dict[target['applicants']], '>=', targetDateFrom)
        );
        filter.push(where(date_dict[target['applicants']], '<=', targetDateTo));
      }
    } else if (fix_db.includes(item)) {
      ref = collection(db, 'fix');
      if (ignore_fix) filter.push(where('ignore', '==', false));
      if (target != undefined) {
        filter.push(where(date_dict[target['fix']], '>=', targetDateFrom));
        filter.push(where(date_dict[target['fix']], '<=', targetDateTo));
      }
    } else if (bo_db.includes(item)) {
      ref = collection(db, 'BO');
      if (target != undefined) {
        filter.push(where(date_dict[target['bo']], '>=', targetDateFrom));
        filter.push(where(date_dict[target['bo']], '<=', targetDateTo));
      }
    } else {
      return [];
    }
    data_average[index] = (
      await getCountFromServer(query(ref, ...filter))
    ).data().count;
    data_average[index] /= number_of_member;
  }
  return data_average;
};
