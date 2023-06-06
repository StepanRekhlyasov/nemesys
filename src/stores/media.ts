import {
  collection,
  query,
  getFirestore,
  getDocs,

} from 'firebase/firestore';
import { defineStore } from 'pinia';
export const useMedia = defineStore('media', () => {
  const db = getFirestore();

  const getAllmedia = async (

  ) => {
    const mediaRef = collection(db, 'media');
    const querys = query(mediaRef);
    const docSnap = await getDocs(querys);
    const media_names:string[] = [];
    for(const doc of docSnap.docs){
      media_names.push(doc.data().name);
    }
    return media_names;
  };
  return {getAllmedia};
});
