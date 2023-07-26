import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  addDoc,
  doc as docDb,

} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { getAuth } from 'firebase/auth';
import {JobModel} from 'src/shared/model/Jobs.model'
import { useOrganization } from './organization';

export const useJobPostingHistory = defineStore('jobPostingHistory', () => {
  const db = getFirestore();
  const auth = getAuth()
  const organization = useOrganization()
  const loadJobAdsData = async () => {
    const jobAdsData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobAds'),
        where('deleted', '==', false),
        where('organizationId', '==', organization.currentOrganizationId)
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

  const updateFormData = async (data:object) => {
    data['updated_at'] = serverTimestamp();
    data['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobAds', data['id']), data);
  };

  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    data['organizationId'] = organization.currentOrganizationId

    await addDoc(collection(db, 'jobAds'), data);
  };
const getJobsdata = async() =>{
  const jobsData: JobModel[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobs'),
        where('deleted', '==', false),
        where('organizationId', '==', organization.currentOrganizationId)
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      jobsData.push({
        ...data,
        value: doc.id,
      });
    });

    return jobsData;
  };

  const getJobFormatData = async() =>{
    const jobFormatData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobFormat'),
        where('deleted', '==', false),
        where('organizationId', '==', organization.currentOrganizationId)
      )
    );
    q.forEach(async(doc) => {
      const dataDoc = doc.data();
      dataDoc.name = `${dataDoc.name} (${dataDoc.desc})`;
      jobFormatData.push({
        ...dataDoc,
        value: doc.id,
      });
    });

    return jobFormatData;
  }

  const getPhraseData = async (options) => {
    const q = await getDocs(
      query(
        collection(db, 'jobPhrase'),
        where('deleted', '==', false),
        where('organizationId', '==', organization.currentOrganizationId)
      )
    );
    options.value['occupation'] = [];
    options.value['jobTag'] = [];
    options.value['jobContent'] = [];
    q.forEach(async(doc) => {
      const dataDoc = doc.data();
      dataDoc.name = `${dataDoc.name} (${dataDoc.content})`;
      if (dataDoc.phraseCategory == 'occupation') {
        options.value['occupation'].push({ value: doc.id, ...dataDoc } as never);
    } else if (dataDoc.phraseCategory == 'jobTagline') {
        options.value['jobTag'].push({ value: doc.id, ...dataDoc } as never);
    }
    else if (dataDoc.phraseCategory == 'jobContent') {
        options.value['jobContent'].push({ value: doc.id, ...dataDoc } as never);
    }
    });
    return options.value
  };

  return {
    loadJobAdsData,
    updateFormData,
    addFormData,
    getJobsdata,
    getJobFormatData,
    getPhraseData
  };
})
