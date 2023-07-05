import { setDoc, updateDoc, collection, getFirestore, serverTimestamp,doc} from 'firebase/firestore';
import { defineStore } from 'pinia';

export const useApplicantSaveSearch = defineStore('applicantSaveSearch',()=>{

const db = getFirestore();

  async function saveSearch(data) {
    let docRef;
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
