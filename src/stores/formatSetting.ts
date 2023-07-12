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
export const useFormatSetting = defineStore('formatSetting', () => {
  const db = getFirestore();
  const auth = getAuth()
  const loadFormatSettingData = async () => {
    const formatSettingData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobFormat'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      formatSettingData.push({
        ...data,
        id: doc.id,
      });
    });

    return formatSettingData;
  };

  const updateFormData = async (data:object) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobFormat', data['id']), updateData);
  };


  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;

    await addDoc(collection(db, 'jobFormat'), data);
  };

  return {
   loadFormatSettingData,
   updateFormData,
   addFormData
  };
});
