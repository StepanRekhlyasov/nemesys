import { collection, query, getFirestore, getDocs, addDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { Media } from 'src/shared/model/Media.model';
import { defineStore } from 'pinia';
export const useMedia = defineStore('media', () => {
  
  const db = getFirestore();
  const getAllmedia = async () => {
    const mediaRef = collection(db, 'media');
    const querys = query(mediaRef);
    const docSnap = await getDocs(querys);
    const mediaList: Media[] = [];
    for (const doc of docSnap.docs) {
      const media: Media = {
        name: doc.data().name,
        id: doc.id,
        createdAt: doc.data().createdAt
      };
      mediaList.push(media);
    }
    return mediaList;
  };
  return { getAllmedia };
});


export const saveOrder = async (order: object) => {
  const db = getFirestore();
  const docRef = doc(db, 'metadata', 'mediaOrder');
  const res = await setDoc(docRef, {...order});
  return res;
}

export const getOrder = async () => {
  const db = getFirestore();
  const docRef = doc(db, 'metadata', 'mediaOrder');
  const docSnap = await getDoc(docRef);
  return docSnap.data();
}

export const addMedia = async (data: Media) => {
  const db = getFirestore();
  const mediaRef = collection(db, 'media');
  const res = await addDoc(mediaRef, data);
  return res.id;
}


export const deleteMedia = async (id: string) => {
  const db = getFirestore();
  const docRef = doc(db, 'media', id);
  const res = await deleteDoc(docRef);
  return res;
}

export const updateMedia = async (id: string, name: string, createdAt: number) => {
  const db = getFirestore();
  const docRef = doc(db, 'media', id);
  const res = await setDoc(docRef, {name: name, createdAt: createdAt});
  return res;
}


