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
export const useJobItemSetting = defineStore('jobItemSetting', () => {
  const db = getFirestore();
  const auth = getAuth()
  const loadJobItemSettingData = async () => {
    const itemSettingData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobItem'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      itemSettingData.push({
        ...data,
        id: doc.id,
      });
    });

    return itemSettingData;
  };

  const updateFormData = async (data:object) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobItem', data['id']), updateData);
  };

  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;

    await addDoc(collection(db, 'jobItem'), data);
  };

  const updateOption = async (id,data:object) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobItem',id,'options', data['id']), updateData);
  };

  const addNewOption = async (id,data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;

    await addDoc(collection(db, 'jobItem',id,'options'), data);
  };
  return {
   loadJobItemSettingData,
   updateFormData,
   addFormData,
   addNewOption,
   updateOption
  };
});
