import {
  where,
  query,
  collection,
  getCountFromServer,
  getFirestore,
} from 'firebase/firestore';
import { defineStore } from 'pinia';
export const useBOIndividualReport = defineStore('BOIndividualReport', () => {

 const getBOIndividualReport = async (
  IdAndNames_branch: { id: string; name: string }[],
  dateRange: { from: string; to: string }
): Promise<{
  rows: {
    name: string;
    number_of_calls_per_day: number;
    number_of_FAX_per_day: number;
    BO_total: number;
    BO_New: number;
    BO_Existing: number;
  }[];
  series: { name: string; data: (number | string)[]; type: string }[];
}> => {
  if (IdAndNames_branch == undefined) return { rows: [], series: [] };
  if (dateRange.from == undefined || dateRange.to == undefined)
    return { rows: [], series: [] };
  const series: { name: string; data: (number | string)[]; type: string }[] =
    [];
  const rows: {
    name: string;
    number_of_calls_per_day: number;
    number_of_FAX_per_day: number;
    BO_total: number;
    BO_New: number;
    BO_Existing: number;
  }[] = [];
  // 0のリストをchartOption.xaxis.categories.length分作成する
  const db = getFirestore();
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const collectionRef = collection(db, 'BO');
  for (const IdAndName of IdAndNames_branch) {
    const Id: string = IdAndName.id;
    const query_list = [
      undefined,
      undefined,
      query(
        collectionRef,
        where('id_registerUser', '==', Id),
        where('created_at', '>=', targetDateFrom),
        where('created_at', '<=', targetDateTo)
      ),
      query(
        collectionRef,
        where('id_registerUser', '==', Id),
        where('created_at', '>=', targetDateFrom),
        where('created_at', '<=', targetDateTo),
        where('is_first', '==', true)
      ),
      query(
        collectionRef,
        where('id_registerUser', '==', Id),
        where('created_at', '>=', targetDateFrom),
        where('created_at', '<=', targetDateTo),
        where('is_first', '==', false)
      ),
    ];
    const data = await Promise.all(
      query_list.map(async (query) => {
        if (query == undefined) return 0;
        const snapshot = await getCountFromServer(query);
        return snapshot.data().count;
      })
    );
    rows.push({
      name: IdAndName.name,
      number_of_calls_per_day: data[0],
      number_of_FAX_per_day: data[1],
      BO_total: data[2],
      BO_New: data[3],
      BO_Existing: data[4],
    });
    series.push({
      name: IdAndName.name,
      data: data,
      type: 'bar',
    });
  }
  return { rows: rows, series: series };
};
return { getBOIndividualReport };
})
