import {
  collection,
  getFirestore,
  getDocs,
  serverTimestamp,
  query,
  where,
  doc as docDb,
  writeBatch
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { getAuth } from 'firebase/auth';

export const useJobSearch = defineStore('jobSearch', () => {
  const db = getFirestore();
  const auth =getAuth()

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

  const loadClientsData = async () => {
    const clientsData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'clients'),
        where('deleted', '==', false),
      )
    );
    q.forEach(async(doc) => {
      clientsData.push({
        label: doc.data().name,
        id: doc.id,
      });
    });

    return clientsData;
  };
  return {
    loadJobSearchData,
    deleteJobSearch,
    loadJobAdsData,
    loadAreaCityData,
    loadJobAreaData,
    deleteJobAreaData,
    loadFormatSettingData,
    loadJobPhraseData,
    loadJobItemSettingData,
    loadClientsData
  };
});
