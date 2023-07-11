import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
  doc as docDb
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { getAuth } from 'firebase/auth';
const auth = getAuth()
export const useRegionalSalarySetting = defineStore('regionalSalarySetting', () => {
  const db = getFirestore();

  const loadJobAreaData = async () => {
    const jobAreaData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobArea'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      jobAreaData.push({
        ...data,
        id: doc.id,
      });
    });

    return jobAreaData;
  };

  const loadAreaCityData = async () => {
    const areaCityData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'areaCity'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      areaCityData.push({
        ...data,
        id: doc.id,
      });
    });

    return areaCityData;
  };

  const deleteJobAreaData = async (id:string) => {
    const updateData = {
      deleted: true,
      deleted_by: auth.currentUser?.uid,
      deleted_at: serverTimestamp()
    };

    const batch = writeBatch(db);
      const docRef = docDb(db, 'jobArea', id);
      batch.update(docRef, updateData);
    await batch.commit();
  };

  return {
    loadJobAreaData,
    loadAreaCityData,
    deleteJobAreaData
  };
});
