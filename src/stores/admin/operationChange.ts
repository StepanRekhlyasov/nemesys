import { addDoc, collection, DocumentData, FieldValue, getDocs, getFirestore, orderBy, query, QuerySnapshot, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref } from 'vue';

type OperationChangeState = {
  wholeOperationDocs: QuerySnapshot<DocumentData> | never[],
  operationStoppedDocs: QuerySnapshot<DocumentData> | never[],
  operationWorkingDocs: QuerySnapshot<DocumentData> | never[],
}

type OperationType = {
  typeOperation: 'stop' | 'resume' ,
  date: FieldValue,
  executor: string,
  note: string,
  timeFromPreviousOperation: number
}

export const useOperationChange = defineStore('operationChange', () => {
  const state = ref<OperationChangeState>({
    wholeOperationDocs: [],
    operationStoppedDocs: [],
    operationWorkingDocs: [],
})

  const db = getFirestore();

  const getOperationDocs = async () => {
    state.value.wholeOperationDocs = await getDocs(query(collection(db, 'maintainModeEvent'), orderBy('date', 'desc')));
    state.value.operationStoppedDocs = await getDocs(query(collection(db, 'maintainModeEvent'), where('typeOperation', '==', 'stop'), orderBy('date', 'desc')));
    state.value.operationWorkingDocs = await getDocs(query(collection(db, 'maintainModeEvent'), where('typeOperation', '==', 'resume'), orderBy('date', 'desc')));
  }

  const addOperation = async (data: OperationType) => {
    const operationRef = collection(db, 'maintainModeEvent')
    return await addDoc(operationRef, data)
  }

  return {
    state,
    getOperationDocs,
    addOperation
  }

})
