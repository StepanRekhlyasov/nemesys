import {
  doc,
  collection,
  addDoc,
  query,
  where,
  getFirestore,
  serverTimestamp,
  getDoc,
  getDocs,
  updateDoc,
  FieldValue,
} from 'firebase/firestore';

const db = getFirestore();

export default {
  getColumns() {
    return getDocs(
      query(collection(db, 'kabanGroup'), where('deleted', '==', false))
    );
  },
  getApplicant(applicantId: string) {
    return getDoc(doc(db, 'applicant', applicantId));
  },
  createCard(card: {
    created_at: FieldValue;
    updated_at: FieldValue;
    deleted: boolean;
  }) {
    card['created_at'] = serverTimestamp();
    card['updated_at'] = serverTimestamp();
    card['deleted'] = false;
    return addDoc(collection(db, 'applicant'), card);
  },
  updateApplicant(data: {
    id?: string;
    updated_at: FieldValue;
    created_at?: FieldValue;
  }) {
    const id = data.id;
    delete data.id;
    delete data.created_at;
    data['updated_at'] = serverTimestamp();
    return updateDoc(doc(db, 'applicant/' + id), data);
  },
  //group
  getColumnData(groupId: string) {
    return getDocs(
      query(
        collection(db, 'applicant'),
        where('groupId', '==', groupId),
        where('deleted', '==', false)
      )
    );
  },
  getGroup(id: string) {
    return getDoc(doc(db, 'kabanGroup', id));
  },
  createGroup(data: {
    deleted: boolean;
    updated_at: FieldValue;
    created_at?: FieldValue;
  }) {
    data['created_at'] = serverTimestamp();
    data['updated_at'] = serverTimestamp();
    data['deleted'] = false;
    return addDoc(collection(db, 'kabanGroup'), data);
  },
  updateGroup(data: {
    id?: string;
    updated_at: FieldValue;
    created_at?: FieldValue;
  }) {
    const id = data.id;
    delete data.id;
    delete data.created_at;
    data['updated_at'] = serverTimestamp();
    return updateDoc(doc(db, 'kabanGroup/' + id), data);
  },
};
