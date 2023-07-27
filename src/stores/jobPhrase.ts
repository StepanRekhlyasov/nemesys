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
import {ref} from 'vue'
import { getAuth } from 'firebase/auth';
import { useOrganization } from './organization';
import { JobPhraseData } from 'src/shared/model/Jobs.model';

export const useJobPhrase = defineStore('jobPhrase', () => {

 const state = ref<JobPhraseData>({
  selectedJobPhrase:{}
 })
  const db = getFirestore();
  const auth = getAuth()
  const organization = useOrganization()

  const loadJobPhraseData = async () => {
    const jobPhraseData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobPhrase'),
        where('deleted', '==', false),
        where('organizationId', '==', organization.currentOrganizationId)
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
    data['updated_at'] = serverTimestamp();
    data['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobPhrase', data['id']), data);
  };


  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    data['organizationId'] = organization.currentOrganizationId
    await addDoc(collection(db, 'jobPhrase'), data);
  };

  return {
    loadJobPhraseData,
    updateFormData,
    addFormData,
    state
  };
});
