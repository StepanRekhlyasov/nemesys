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
import {ref} from 'vue'
import { getAuth } from 'firebase/auth';
import { useOrganization } from './organization';
import { JobItemData } from 'src/shared/model/Jobs.model';
export const useJobItemSetting = defineStore('jobItemSetting', () => {

  const state = ref<JobItemData>({
  selectedJobItem:{}
 })
  const db = getFirestore();
  const auth = getAuth()
  const organization = useOrganization()
  const loadJobItemSettingData = async () => {
    const itemSettingData: object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobItem'),
        where('deleted', '==', false),
        where('organizationId', '==', organization.currentOrganizationId)
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
    data['updated_at'] = serverTimestamp();
    data['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobItem', data['id']), data);
  };

  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    data['organizationId'] = organization.currentOrganizationId
    await addDoc(collection(db, 'jobItem'), data);
  };

  const updateOption = async (id,data:object) => {
    data['updated_at'] = serverTimestamp();
    data['updated_by'] = auth.currentUser?.uid;
    await updateDoc(docDb(db, 'jobItem',id,'options', data['id']), data);
  };

  const addNewOption = async (id,data:object) => {
    data['created_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    data['organizationId'] = organization.currentOrganizationId
    const docRef = await addDoc(collection(db, 'jobItem',id,'options'), data);
    const docRefId = docRef.id
    return docRefId

  };
  const addId = async (id,data:object,optionId) => {
    data['id'] = optionId
    await updateDoc(docDb(db, 'jobItem',id,'options', data['id']), data);
  };
  const fetchJobItemOptionsData = async (id) => {
  const jobItemOption: object[] = [];
  const q = await getDocs(
    query(
      collection(db, 'jobItem',id,'options'),
      where('deleted', '==', false),
      where('organizationId', '==', organization.currentOrganizationId)
    )
  );
  q.forEach(async(doc) => {
    const data = doc.data();
    jobItemOption.push({
      ...data,
      id: doc.id,
    });
  });

  return jobItemOption;
};
const loadJobSearchData = async () => {
  const jobSearchData: object[] = [];
  const q = await getDocs(
    query(
      collection(db, 'jobs'),
      where('deleted', '==', false),
      where('organizationId', '==', organization.currentOrganizationId)
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


  return {
   loadJobItemSettingData,
   updateFormData,
   addFormData,
   addNewOption,
   updateOption,
   fetchJobItemOptionsData,
   loadJobSearchData,
   state,
   addId
  };
});
