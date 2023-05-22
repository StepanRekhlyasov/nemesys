import {
  collection,
  query,
  where,
  getFirestore,
  getCountFromServer,
} from 'firebase/firestore';

export const getIndividualReport = async (
  IdAndNames_branch: { id: string; name: string }[],
  dateRange: { from: string; to: string },
  graph_type: string
): Promise<{
  rows: {
    name: string;
    fix: number;
    inspection: number;
    offer: number;
    admission: number;
    inspection_rate: string;
    offer_rate: string;
    admission_rate: string;
  }[];
  series: { name: string; data: (number | string)[]; type: string }[];
}> => {
  const db = getFirestore();
  const rows: {
    name: string;
    fix: number;
    inspection: number;
    offer: number;
    admission: number;
    inspection_rate: string;
    offer_rate: string;
    admission_rate: string;
  }[] = [];
  let DateTargets: string[] = [];
  if (graph_type == 'BasedOnEachItemDate') {
    DateTargets = ['data', 'inspectionDate', 'offerDate', 'admissionDate'];
  } else if (graph_type == 'BasedOnLeftMostItemDate') {
    DateTargets = ['data', 'data', 'data', 'data'];
  }
  if (IdAndNames_branch == undefined) return { rows: [], series: [] };
  if (dateRange.from == undefined || dateRange.to == undefined)
    return { rows: [], series: [] };
  const series: { name: string; data: (number | string)[]; type: string }[] =
    [];
  // 0のリストをchartOption.xaxis.categories.length分作成する
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'fix');
  for (const IdAndName of IdAndNames_branch) {
    const Id: string = IdAndName.id;
    const query_list = [
      query(
        collectionRef,
        where('contactPerson', '==', Id),
        where(DateTargets[0], '>=', targetDateFrom),
        where(DateTargets[0], '<=', targetDateTo),
        where('status', '==', 'ok')
      ),
      query(
        collectionRef,
        where('chargeOfInspection', '==', Id),
        where(DateTargets[1], '>=', targetDateFrom),
        where(DateTargets[1], '<=', targetDateTo),
        where('inspectionStatus', '==', 'ok')
      ),
      query(
        collectionRef,
        where('chargeOfOffer', '==', Id),
        where(DateTargets[2], '>=', targetDateFrom),
        where(DateTargets[2], '<=', targetDateTo),
        where('offerStatus', '==', 'ok')
      ),
      query(
        collectionRef,
        where('chargeOfAdmission', '==', Id),
        where(DateTargets[3], '>=', targetDateFrom),
        where(DateTargets[3], '<=', targetDateTo),
        where('admissionStatus', '==', 'ok')
      ),
    ];
    const data = await Promise.all(
      query_list.map(async (query) => {
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count;
      })
    );
    const data_cvr = data.map((num, idx) => {
      if (idx == 0) return '100.0%';
      if (data[idx - 1] == 0) return '0.0%';
      const per = (data[idx] / data[idx - 1]) * 100;
      const per_str = per.toFixed(1);
      return per_str + '%';
    });
    rows.push({
      name: IdAndName.name,
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
      data: data,
      type: 'bar',
    });
  }
  return { rows: rows, series: series };
};
