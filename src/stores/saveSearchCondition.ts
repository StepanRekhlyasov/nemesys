import { defineStore } from 'pinia';
import {
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  collection,
  getFirestore,
  serverTimestamp,
  Timestamp,
  query,
  where,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ref } from 'vue';
import { useOrganization } from 'src/stores/organization';
export const useSaveSearchCondition = defineStore('saveSearchCondition', () => {
  const db = getFirestore();
  const auth = getAuth();
  const unsubscribe = ref();
  const searchConditions = ref(<DocumentData[]>[]);
  const organizationStore = useOrganization();
  
  const saveSearchCondition = async (data) => {
    // const user = await useStore.getUserById(auth.currentUser?.uid as string);
    // if (user) {
    //   data['branch_id'] = user.branch_id;
    // }
    data['organizationIds'] = organizationStore.currentOrganizationId
    data['created_at'] = serverTimestamp();
    data['deleted'] = false;
    data['created_by'] = auth.currentUser?.uid;
    await addDoc(collection(db, '/saveSearchCondition'), {
      ...data,
    });
    ;
  };
  async function getSaveSearchConditions(currentOrganization:string) {
    
    // if(searchData.selectedOrganization) {
    //   filters.push(where('organizationIds', '==', searchData.selectedOrganization))
    // }
    const q = query(collection(db, 'saveSearchCondition'),where('organizationIds','==',currentOrganization));

    if (unsubscribe.value) {
      unsubscribe.value();
    }

    unsubscribe.value = onSnapshot(q, (querySnapshot) => {
      const items: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data['id'] = doc.id;
        items.push(data);
      });
      searchConditions.value = items;
    });
  }
  async function deleteSaveSearchCondition(id:string){
    const docRef = doc(collection(db,'saveSearchCondition'), id);
    await deleteDoc(docRef);
  }
  async function updateSaveSearchCondition(id:string,data){
    data['updated_at'] = serverTimestamp();
    data['updated_by'] = auth.currentUser?.uid;
    const docRef = doc(collection(db,'saveSearchCondition'), id);
    await updateDoc(docRef,data);
  }
  return { saveSearchCondition,getSaveSearchConditions, deleteSaveSearchCondition,updateSaveSearchCondition, searchConditions };
});