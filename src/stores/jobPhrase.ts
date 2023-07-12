import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  addDoc,
  doc as docDb

} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { getAuth } from 'firebase/auth';

export const useJobPhrase = defineStore('jobPhrase', () => {
  const db = getFirestore();
  const auth = getAuth()
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

  const updateFormData = async (data:object) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobPhrase', data['id']), updateData);
  };


  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;

    await addDoc(collection(db, 'jobPhrase'), data);
  };

  return {
    loadJobPhraseData,
    updateFormData,
    addFormData
  };
});
