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
import {ref} from 'vue'
import { getAuth } from 'firebase/auth';
import { useI18n } from 'vue-i18n';
import {Client,ClientOffice} from 'src/shared/model/Client.model'
import { useOrganization } from './organization';
import { JobDataObject } from 'src/shared/model/Jobs.model';

export const useJobSearch = defineStore('jobSearch', () => {

 const state = ref<JobDataObject>({
  selectedJob:{}
 })
  const db = getFirestore();
  const auth = getAuth()
  const organization = useOrganization()
  const { t } = useI18n({
    useScope: 'global',
  });
  const loadJobSearchData = async () => {
    const jobSearchData:Client[] = [];
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
        collection(db, 'clients'),
        where('deleted', '==', false),
      )
    );

    q.forEach(async(doc) => {
      clientData.push({
        label:doc.data().name,
        id: doc.id,
      });
    });
    return clientData;
  };

  const updateFormData = async (data:object) => {
    data['updated_at'] = serverTimestamp();
    data['updated_by'] = auth.currentUser?.uid;

    await updateDoc(docDb(db, 'jobs', data['id']), data);
  };


  const addFormData = async (data:object) => {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    data['organizationId'] = organization.currentOrganizationId

    await addDoc(collection(db, 'jobs'), data);
  };

  const loadJobItemSettingData = async (jobItemOptions,jobItems) => {
    const q = query(collection(db, 'jobItem'), where('deleted', '==', false));
    const querySnapshotJobItem = await getDocs(q);
    querySnapshotJobItem.forEach(async (doc) => {
        const data = doc.data();
        if (data['dataType']) {
            data['dataType'] = t('jobItem.dataTypeList.' + data['dataType']);
        }
        jobItems.value[doc.id] = data;
        const qOption = query(collection(db, 'jobItem', doc.id, 'options'), where('deleted', '==', false),where('organizationId', '==', organization.currentOrganizationId));
        const querySnapshotqOption = await getDocs(qOption);
        const items:object[] = []
        querySnapshotqOption.forEach((docOption) => {
            items.push(docOption.data() as never);
        });
        jobItemOptions.value[doc.id] = items;

    });
  };
  const loadJobItemData = async (jobItems)=>{
    const jobItemData:object[] = [];
    const q = await getDocs(
      query(
        collection(db, 'jobItem'),
        where('deleted', '==', false),
        where('organizationId', '==', organization.currentOrganizationId)
      )
    );
    q.forEach(async(doc) => {
      const data = doc.data();
      jobItems.value[doc.id] = data;
      jobItemData.push({
        ...data,
        id: doc.id,
      });
    });

    return jobItemData;
  };

const loadOfficeData = async (id:string) => {
  const officeData:ClientOffice[] = [];
  const q = await getDocs(
    query(
      collection(db, 'clients', id, 'client-factory'),
    )
  );
  q.forEach((doc) => {
    const data = doc.data();
    officeData.push({
      label: data.name,
      id:doc.id
    });
  });
  return officeData;
};

const addNewOption = async (id: string, data: object) => {
  data['created_at'] = serverTimestamp();
  data['deleted'] = false;
  data['created_by'] = auth.currentUser?.uid;
  data['organizationId'] = organization.currentOrganizationId
  const docRef = await addDoc(collection(db, 'jobItem', id, 'options'), data);
  const docRefId = docRef.id
  return docRefId
};

const updateOption = async (id,data:object) => {
  data['updated_at'] = serverTimestamp();
  data['updated_by'] = auth.currentUser?.uid;
  data['name'] = data['name']
  await updateDoc(docDb(db, 'jobItem',id,'options', data['id']), data);
};
const addId = async (id,data:object,optionId) => {
  data['id'] = optionId
  await updateDoc(docDb(db, 'jobItem',id,'options', data['id']), data);
};
const getIndustries = async () => {
  const industriesData: object[] = [];
  const q = await getDocs(
    query(
      collection(db, 'industries'),
    )
  );
  q.forEach(async(doc) => {
    const data = doc.data();
    industriesData.push({
      ...data,
      id: doc.id,
    });
  });

  return industriesData;
};
  return {
    loadJobSearchData,
    deleteJobSearch,
    loadClientsData,
    updateFormData,
    addFormData,
    loadJobItemSettingData,
    loadOfficeData,
    loadJobItemData,
    updateOption,
    addNewOption,
    addId,
    getIndustries,
    state
  };
});
