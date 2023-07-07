import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where,
  doc as docDb,
  writeBatch,
  getDoc,
  updateDoc
} from 'firebase/firestore';
import { defineStore } from 'pinia';
import { toDate } from 'src/shared/utils/utils';
import { ClientMemo } from 'src/shared/model/Client.model';
import { getAuth , User } from '@firebase/auth';
import { useQuasar } from 'quasar';
export const useMemo = defineStore('Memo', () => {
  const db = getFirestore();
  const auth = getAuth();
  const $q = useQuasar();

  const loadMemoData = async (clientId: string) => {
  const MemoData: ClientMemo[] = [];
  const userData = await getDoc(docDb(collection(db,'users'),auth.currentUser?.uid))
  const q = await getDocs(
    query(
      collection(db, 'clients', clientId, 'memo'),
      where('deleted', '==', false),
      )
    );
      q.forEach(async(doc) => {
      const data = doc.data();
      const registerUser = userData.data()
      MemoData.push({
        ...data,
        id: doc.id,
        userName:registerUser,
        created_date: toDate(data.created_date),
        updated_date: toDate(data.updated_date)
      });
    });
    return MemoData;
    };

   const deleteMemo = async (ids,clientId:string) => {
   const user = $q.localStorage.getItem('user') as User;
   const updateData = {};
     updateData['deleted'] = true;
     updateData['deleted_by'] = user.uid;
     updateData['deleted_at'] = serverTimestamp();
    const batch = writeBatch(db);
    for (const id of ids) {
   const docRef = docDb(db, 'clients', clientId, 'memo', id);
      batch.update(docRef, updateData);
    }
    await batch.commit();
  };

  const updateMemo = async (clientId: string, content,id) => {
    const updateData = {};
    updateData['updated_at'] = serverTimestamp();
    updateData['updated_by'] = auth.currentUser?.uid;
    updateData['content'] = content
    await updateDoc(docDb(db, 'clients', clientId, 'memo', id), updateData);
  };

  const addNewMemo = async (clientId:string,content:string) => {
  const data = {}
    data['content'] = content;
    data['created_date'] = serverTimestamp();
    data['updated_date'] = serverTimestamp();
    data['deleted'] = false;
    data['created_user'] = auth.currentUser?.uid;
    await addDoc(collection(db, 'clients', clientId, 'memo'), data);
  }

 return {
   loadMemoData,
   updateMemo,
   addNewMemo,
   deleteMemo
   };
 });
