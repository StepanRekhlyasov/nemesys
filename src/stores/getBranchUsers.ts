import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
} from 'firebase/firestore';

export const getUser = async (branch_id: string) => {
  const db = getFirestore();
  const user_list: { id: string; name: string }[] = [];
  const collectionRef = collection(db, 'users');
  const q = query(collectionRef, where('branch_id', '==', branch_id));
  const snapshot = await getDocs(q);
  snapshot.forEach((doc) => {
    user_list.push({ id: doc.id, name: doc.data().displayName });
  });
  return user_list;
};
