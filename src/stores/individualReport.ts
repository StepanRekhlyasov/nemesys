import {
  collection,
  query,
  where,
  Query,
  DocumentData,
  getFirestore,
  getCountFromServer,
} from 'firebase/firestore';

const dateDictBasedOnEachItemDate: { [key: string]: string } = {
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

const dateDictBasedOnLeftMostItemDate: { [key: string]: string } = {
  applicants: 'applicationDate',
  valid_applicants: 'applicationDate',
  contact_applicants: 'applicationDate',
  attraction_applicants: 'applicationDate',
  attend_applicants: 'applicationDate',
  fix: 'data',
  inspection: 'data',
  offer: 'data',
  admission: 'data',
  bo: 'created_at',
  bo_isfirst: 'created_at',
  bo_isnotfirst: 'created_at',
};
type rowType = {
  name: string;
  BO_NC: number;
  BO_N: number;
  BO_Dispatch: number;
  BO_introduction: number;
  BO_TTP: number;
  applicants: number;
  attraction: number;
  attend: number;
  fix: number;
  inspection: number;
  offer: number;
  admission: number;
  inspection_rate: string;
  offer_rate: string;
  admission_rate: string;
}[]

export const getIndividualReport = async (
  IdAndNames_branch: { id: string; name: string }[],
  dateRange: { from: string; to: string }|undefined,
  graphType: string,
  totalingApplicant = false,
  totalingBO = false
): Promise<{
  rows:rowType;
  series: { name: string; data: (number | string)[]; type: string }[];
}> => {
  const db = getFirestore();
  const rows:rowType = [];
  let dataDict: { [key: string]: string } = dateDictBasedOnEachItemDate;
  if (graphType == 'BasedOnLeftMostItemDate') {
    dataDict = dateDictBasedOnLeftMostItemDate;
  }
  if (!dateRange||!IdAndNames_branch||!dateRange.from || !dateRange.to) return { rows: [], series: [] };
  const series: { name: string; data: (number | string)[]; type: string }[] =
    [];
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const fixRef = collection(db, 'fix');
  const applicantRef = collection(db, 'applicants');
  const BORef = collection(db, 'bo');
  for (const IdAndName of IdAndNames_branch) {
    const Id: string = IdAndName.id;
    const fixQueryList = [
      query(
        fixRef,
        where('chargeOfFix', '==', Id),
        where(dataDict['fix'], '>=', targetDateFrom),
        where(dataDict['fix'], '<=', targetDateTo),
        where('fixStatus', '==', true)
      ),
      query(
        fixRef,
        where('chargeOfInspection', '==', Id),
        where(dataDict['inspection'], '>=', targetDateFrom),
        where(dataDict['inspection'], '<=', targetDateTo),
        where('inspectionStatus', '==', true)
      ),
      query(
        fixRef,
        where('chargeOfOffer', '==', Id),
        where(dataDict['offer'], '>=', targetDateFrom),
        where(dataDict['offer'], '<=', targetDateTo),
        where('offerStatus', '==', true)
      ),
      query(
        fixRef,
        where('chargeOfAdmission', '==', Id),
        where(dataDict['admission'], '>=', targetDateFrom),
        where(dataDict['admission'], '<=', targetDateTo),
        where('admissionStatus', '==', true)
      ),
    ];

    const applicantList = [
      query(
        applicantRef,
        where(dataDict['applicants'], '>=', targetDateFrom),
        where(dataDict['applicants'], '<=', targetDateTo)
      ),
      query(
        applicantRef,
        where('attractionStatus', '==', true),
        where(dataDict['attraction_applicants'], '>=', targetDateFrom),
        where(dataDict['attraction_applicants'], '<=', targetDateTo)
      ),
      query(
        applicantRef,
        where('attendStatus', '==', true),
        where(dataDict['attend_applicants'], '>=', targetDateFrom),
        where(dataDict['attend_applicants'], '<=', targetDateTo)
      ),
    ];

    const BOlist = [
      query(
        BORef,
        where(dataDict['bo'], '>=', targetDateFrom),
        where(dataDict['bo'], '<=', targetDateTo),
        where('typeCase','==','nursingCare'),

      ),
      query(
        BORef,
        where(dataDict['bo'], '>=', targetDateFrom),
        where(dataDict['bo'], '<=', targetDateTo),
        where('typeCase','==','nurse'),

      ),
      query(
        BORef,
        where(dataDict['bo'], '>=', targetDateFrom),
        where(dataDict['bo'], '<=', targetDateTo),
        where('transactionType', '==', 'generalDispatch')
      ),
      query(
        BORef,
        where(dataDict['bo'], '>=', targetDateFrom),
        where(dataDict['bo'], '<=', targetDateTo),
        where('transactionType', '==', 'introduction')
      ),
      query(
        BORef,
        where(dataDict['bo'], '>=', targetDateFrom),
        where(dataDict['bo'], '<=', targetDateTo),
        where('transactionType', '==', 'TTP')
      ),
    ];
    let QueryList: Query<DocumentData>[] = [];
    if (totalingApplicant) {
      QueryList = fixQueryList.concat(applicantList);
    } else {
      const zeroList = new Array(applicantList.length).fill(0);
      QueryList = fixQueryList.concat(zeroList);
    }

    if(totalingBO){
      QueryList = QueryList.concat(BOlist);
    }else{
      const zeroList = new Array(BOlist.length).fill(0);
      QueryList = QueryList.concat(zeroList);
    }

    const data = await Promise.all(
      QueryList.map(async (query) => {
        if (typeof query == 'number') return query;
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count;
      })
    );

    const data_cvr = data.map((idx) => {
      if (idx == 0) return '100.0%';
      if (data[idx - 1] == 0) return '0.0%';
      const per = (data[idx] / data[idx - 1]) * 100;
      const per_str = per.toFixed(1);
      return per_str + '%';
    });
    rows.push({
      name: IdAndName.name,
      BO_NC: data[7],
      BO_N: data[8],
      BO_Dispatch:data[9],
      BO_introduction: data[10],
      BO_TTP: data[11],
      applicants: data[4],
      attraction: data[5],
      attend: data[6],
      fix: data[0],
      inspection: data[1],
      offer: data[2],
      admission: data[3],
      inspection_rate: data_cvr[1],
      offer_rate: data_cvr[2],
      admission_rate: data_cvr[3],
    });

    series.push({
      name: IdAndName.name,
      data: data.splice(0, 4),
      type: 'bar',
    });
  }
  return { rows: rows, series: series };
};
