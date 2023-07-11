import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,

} from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useJobPostingHistory = defineStore('jobPostingHistory', () => {
  const db = getFirestore();

  const loadJobAdsData = async () => {
    const jobAdsData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobAds'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      jobAdsData.push({
        ...data,
        id: doc.id,
      });
    });

    return jobAdsData;
  };

  return {
    loadJobAdsData,
  };
});
