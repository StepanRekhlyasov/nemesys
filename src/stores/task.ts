import { collection, doc, getDocs, getFirestore, query, setDoc, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { Task } from 'src/shared/model/Tasks.model';

const db = getFirestore();

export const useTask = defineStore('task', () => {
  const createTask = async (saveData : Partial<Task>) => {
    const docRef = doc(collection(db, 'tasks'));
    saveData.id = docRef.id;
    for (const [key, value] of Object.entries(saveData)) {
      if (typeof value === 'undefined') delete saveData[key];
    }
    await setDoc(
      docRef,
      saveData
    );
  }
  const getTasks = async (entity : 'applicant' | 'office') => {
    const q = query(collection(db, 'tasks'), where('taskEntity', '==', entity));
    const snapshot = await getDocs(q);
    return snapshot?.docs.map((doc) => {
      return {...doc.data(), id: doc.id}
    })
  }

  return { createTask, getTasks }
})