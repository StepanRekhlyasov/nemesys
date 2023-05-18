import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
const secondperday = 60 * 60 * 24;
export const calcLeadtime = async (
  dateRange: { from: string; to: string },
  organization_id: string
) => {
  const db = getFirestore();
  const data_average: number[] = Array(5).fill(0);
  const targetDateFrom = new Date(dateRange.from);
  const targetDateTo = new Date(dateRange.to);
  const snapshot = await getDocs(
    query(
      collection(db, 'fix'),
      where('organization_id', '==', organization_id),
      where('data', '>=', targetDateFrom),
      where('data', '<=', targetDateTo)
    )
  );
  let num_i_d = 0;
  let num_o_i = 0;
  let num_a_o = 0;
  let num_ap = 0;
  await Promise.all(
    snapshot.docs.map(async (doc_) => {
      const data = doc_.data();
      const offerDate = data.offerDate;
      const dataDate = data.data;
      const inspectiondate = data.inspectionDate;
      const admissiondate = data.admissionDate;
      const applicantData = (
        await getDoc(doc(db, 'applicants', data.applicant_id))
      ).data();

      if (
        applicantData !== undefined &&
        applicantData.attractionDate !== undefined
      ) {
        data_average[0] +=
          (applicantData.attractionDate - applicantData.applicationDate) /
          secondperday;
        data_average[1] +=
          (dataDate - applicantData.attractionDate) / secondperday;
        num_ap += 1;
      }

      if (inspectiondate !== undefined) {
        data_average[2] += (inspectiondate - dataDate) / secondperday;
        num_i_d += 1;
      }
      if (offerDate !== undefined) {
        data_average[3] += (offerDate - inspectiondate) / secondperday;
        num_o_i += 1;
      }
      if (admissiondate !== undefined) {
        data_average[4] += (admissiondate - offerDate) / secondperday;
        num_a_o += 1;
      }
    })
  );
  //data_averageをsnapshot.sizeで割る
  data_average[0] /= num_ap;
  data_average[1] /= num_ap;
  data_average[2] /= num_i_d;
  data_average[3] /= num_o_i;
  data_average[4] /= num_a_o;
  return data_average;
};
