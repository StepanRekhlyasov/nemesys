import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,

} from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useJobItemSetting = defineStore('jobItemSetting', () => {
  const db = getFirestore();

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

  return {
   loadJobItemSettingData,
  };
});
