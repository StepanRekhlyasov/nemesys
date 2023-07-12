import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
  doc as docDb,
  addDoc,
  updateDoc
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

  const updateFormData = async (data:object) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobArea', data['id']), data);
  };


  const addFormData = async (data) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;

    await addDoc(collection(db, 'jobArea'), data);
  };

  const addNewCity = async (data,id) => {
    const batch = writeBatch(db);
    const cityData = {};
    cityData['createsd_at'] = serverTimestamp();
    cityData['updated_at'] = serverTimestamp();
    cityData['deleted'] = false;
    cityData['monthlySalaryCap'] = data['monthlySalaryCap'];
    cityData['monthlySalaryMin'] = data['monthlySalaryMin'];
    cityData['hourlySalaryCap'] = data['hourlySalaryCap'];
    cityData['hourlySalaryMin'] = data['hourlySalaryMin'];

    for (let i = 0; i < data['prefecture'].length; i++) {
        cityData['prefecture'] = data['prefecture'][i];
        for (let j = 0; j < data['ward'][cityData['prefecture']].length; j++) {
            cityData['ward'] = data['ward'][cityData['prefecture']][j];
            const docRef = docDb(collection(db, 'jobArea', id, 'areaCity'));
            cityData['id'] = docRef.id;
            batch.set(docRef, cityData)
        }
    }
    await batch.commit();
  }

  return {
    loadJobAreaData,
    loadAreaCityData,
    deleteJobAreaData,
    updateFormData,
    addFormData,
    addNewCity
  };
});
