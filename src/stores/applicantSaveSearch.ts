import { setDoc, updateDoc, collection, getFirestore, serverTimestamp,doc, DocumentData,DocumentReference} from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useApplicantSaveSearch = defineStore('applicantSaveSearch',()=>{

const db = getFirestore();

  async function saveSearch(data:DocumentData) {
    let docRef:DocumentReference<DocumentData>;
    if (!data['id']){
      data['created_at'] = serverTimestamp();
      data['deleted'] = false;
      docRef = doc(collection(db, 'applicantSaveSearch'));
      data['id'] = docRef.id;
      await setDoc(docRef, data);
    } else {
      docRef = doc(db, 'applicantSaveSearch', data['id']);
      data['updated_at'] = serverTimestamp();
      await updateDoc(docRef, data);
    }

    return true
  }

  return {saveSearch}
})
