import {
  collection,
  getFirestore,
  getDocs,
  serverTimestamp,
  query,
  where,
  doc as docDb,
  writeBatch,
  updateDoc,
  addDoc
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { getAuth } from 'firebase/auth';

export const useJobSearch = defineStore('jobSearch', () => {
  const db = getFirestore();
  const auth = getAuth()

  const loadJobSearchData = async () => {
    const jobSearchData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobs'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      jobSearchData.push({
        ...data,
        id: doc.id,
      });
    });

    return jobSearchData;
  };

  const deleteJobSearch = async (id:string) => {
    const updateData = {
      deleted: true,
      deleted_by: auth.currentUser?.uid,
      deleted_at: serverTimestamp()
    };

    const batch = writeBatch(db);
      const docRef = docDb(db, 'jobs', id);
      batch.update(docRef, updateData);
    await batch.commit();
  };


  const loadClientsData = async () => {
    const clientData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobItem'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      clientData.push({
        ...data,
        id: doc.id,
      });
    });

    return clientData;
  };

  const updateFormData = async (data:object) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobs', data['id']), updateData);
  };


  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;

    await addDoc(collection(db, 'jobs'), data);
  };

  return {
    loadJobSearchData,
    deleteJobSearch,
    loadClientsData,
    updateFormData,
    addFormData
  };
});
