import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,

} from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useFormatSetting = defineStore('formatSetting', () => {
  const db = getFirestore();

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

  return {
   loadFormatSettingData,
  };
});
