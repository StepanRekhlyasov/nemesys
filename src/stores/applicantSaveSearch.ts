import { setDoc, updateDoc, collection, getFirestore, serverTimestamp, doc, DocumentData, DocumentReference, getDocs, query, where } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { useOrganization } from './organization';

export const useApplicantSaveSearch = defineStore('applicantSaveSearch', () => {

  const db = getFirestore();
  const organization = useOrganization()

  async function saveSearch(data: DocumentData) {
    let docRef: DocumentReference<DocumentData>;
    if (!data['id']) {
      data['organizationId'] = organization.currentOrganizationId
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


  async function getSaveSearch() {
    const collectionRef = query(collection(db, 'applicantSaveSearch'), where('organizationId', '==', organization.currentOrganizationId),where('deleted','==',false));
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(doc => doc.data());
  }

  async function deleteSaveSearch(id: string) {
    const docRef = doc(db, 'applicantSaveSearch', id);
    await updateDoc(docRef, {
      deleted: true,
    });
  }

  return { saveSearch, getSaveSearch, deleteSaveSearch }
})
