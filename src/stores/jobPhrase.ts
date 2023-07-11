import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,

} from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useJobPhrase = defineStore('jobPhrase', () => {
  const db = getFirestore();

  const loadJobPhraseData = async () => {
    const jobPhraseData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobPhrase'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      jobPhraseData.push({
        ...data,
        id: doc.id,
      });
    });

    return jobPhraseData;
  };

  return {
    loadJobPhraseData,
  };
});
