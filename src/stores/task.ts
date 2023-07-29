import { collection, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
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
  const getTaskById = async (id : string) => {
    const q = doc(db, 'tasks/' + id);
    const snapshot = await getDoc(q);
    return {...snapshot.data(), id: snapshot.id} as Task
  }
  const updateTaskStatus = async (id: string, status: string) => {
    const tasksRef = doc(db, 'tasks/' + id);
    await updateDoc(tasksRef, { taskStatus: status, updated_at: serverTimestamp(), })
  }
  const updateTask = async (id: string, saveData: Partial<Task>) => {
    const tasksRef = doc(db, 'tasks/' + id);
    for (const [key, value] of Object.entries(saveData)) {
      if (typeof value === 'undefined') delete saveData[key];
    }
    await updateDoc(tasksRef, saveData)
  }

  return { createTask, getTasks, updateTaskStatus, updateTask, getTaskById }
})